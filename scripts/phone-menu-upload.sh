#!/usr/bin/env bash
set -euo pipefail

# Capital City Provisions phone-friendly menu image uploader
# Run from the repo root in Codespaces:
#   bash scripts/phone-menu-upload.sh
#
# This starts a tiny upload web page. Open the forwarded Codespaces port
# on your phone, tap the menu slot, then tap Choose Image.
# Browser security requires a tap before the phone image picker can open.

PORT="${PORT:-8787}"
MENU_DIR="public/menu"
mkdir -p "$MENU_DIR" uploads .tmp

cat > .tmp/menu-phone-upload-server.py <<'PY'
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse
import cgi
import os
import shutil
import subprocess
import sys
import time

ROOT = os.getcwd()
MENU_DIR = os.path.join(ROOT, 'public', 'menu')
os.makedirs(MENU_DIR, exist_ok=True)

SLOTS = {
    'guarantee': {
        'label': 'Guarantee / Delivery / Payment Menu Graphic',
        'target': os.path.join(MENU_DIR, 'guarantee-menu.png'),
        'public': '/menu/guarantee-menu.png',
        'commit': 'Add guarantee menu graphic',
    },
    'steak': {
        'label': 'Premium Steak Box Pricing Menu Graphic',
        'target': os.path.join(MENU_DIR, 'premium-steak-box.png'),
        'public': '/menu/premium-steak-box.png',
        'commit': 'Add premium steak box menu graphic',
    },
}

def git_output(args):
    try:
        return subprocess.check_output(args, cwd=ROOT, stderr=subprocess.STDOUT, text=True).strip()
    except Exception as exc:
        return str(exc)

class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print('[upload]', fmt % args)

    def send_html(self, html, status=200):
        data = html.encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith('/menu/'):
            local = os.path.join(ROOT, 'public', parsed.path.lstrip('/'))
            if os.path.isfile(local):
                with open(local, 'rb') as f:
                    data = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'image/png')
                self.send_header('Content-Length', str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return

        html = '''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CCP Menu Image Upload</title>
  <style>
    *{box-sizing:border-box}body{margin:0;background:#080504;color:#fff3de;font-family:system-ui,-apple-system,Segoe UI,sans-serif;padding:18px}.wrap{max-width:720px;margin:0 auto}.card{background:linear-gradient(135deg,#1b100b,#080504);border:1px solid #d7a14f;border-radius:22px;padding:18px;margin:14px 0;box-shadow:0 16px 50px rgba(0,0,0,.35)}h1{font-family:Georgia,serif;text-transform:uppercase;line-height:.95;margin:6px 0 10px;font-size:34px}h2{font-size:20px;margin:0 0 8px}.kicker{color:#d7a14f;text-transform:uppercase;letter-spacing:.16em;font-weight:900;font-size:12px}.btn,input[type=file]::file-selector-button,button{width:100%;display:block;background:linear-gradient(135deg,#b1130d,#74110c);color:white;border:1px solid #d7a14f;border-radius:999px;padding:14px 16px;font-weight:900;text-align:center;text-decoration:none;font-size:16px;margin-top:10px}input[type=file]{width:100%;padding:14px;background:#fff;color:#111;border-radius:16px;margin-top:10px}.note{color:#d8c7af;line-height:1.45}.path{font-family:ui-monospace,monospace;background:#150d09;border:1px solid rgba(215,161,79,.4);border-radius:12px;padding:10px;word-break:break-word}.preview{width:100%;border-radius:14px;border:1px solid rgba(215,161,79,.45);margin-top:10px;background:#111}label{display:block;margin-top:10px;font-weight:800}.small{font-size:13px;color:#cdb99e}
  </style>
</head>
<body>
<div class="wrap">
  <p class="kicker">Capital City Provisions</p>
  <h1>Phone Menu Upload</h1>
  <p class="note">Pick one menu slot, choose the image from your phone, and it will save into the exact wired public path.</p>

  <div class="card">
    <h2>1) Guarantee / Delivery / Payment Graphic</h2>
    <p class="path">public/menu/guarantee-menu.png</p>
    <form method="post" enctype="multipart/form-data" action="/upload?slot=guarantee">
      <input type="file" name="image" accept="image/*" required />
      <button type="submit">Upload to Guarantee Menu Slot</button>
    </form>
    <img class="preview" src="/menu/guarantee-menu.png?cache=''' + str(time.time()) + '''" onerror="this.style.display='none'" />
  </div>

  <div class="card">
    <h2>2) Premium Steak Box Pricing Graphic</h2>
    <p class="path">public/menu/premium-steak-box.png</p>
    <form method="post" enctype="multipart/form-data" action="/upload?slot=steak">
      <input type="file" name="image" accept="image/*" required />
      <button type="submit">Upload to Steak Box Menu Slot</button>
    </form>
    <img class="preview" src="/menu/premium-steak-box.png?cache=''' + str(time.time()) + '''" onerror="this.style.display='none'" />
  </div>

  <div class="card">
    <h2>Commit</h2>
    <p class="note">After both images are uploaded, tap this to commit and push.</p>
    <a class="btn" href="/commit">Commit & Push Uploaded Images</a>
    <p class="small">The browser cannot open your phone photo picker without you tapping Choose File. This page is the closest safe version: one tap opens your image picker.</p>
  </div>
</div>
</body>
</html>'''
        self.send_html(html)

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != '/upload':
            self.send_html('<h1>Not found</h1>', 404)
            return
        slot = parse_qs(parsed.query).get('slot', [''])[0]
        if slot not in SLOTS:
            self.send_html('<h1>Bad slot</h1>', 400)
            return
        form = cgi.FieldStorage(fp=self.rfile, headers=self.headers, environ={'REQUEST_METHOD': 'POST', 'CONTENT_TYPE': self.headers.get('Content-Type')})
        if 'image' not in form:
            self.send_html('<h1>No image uploaded</h1>', 400)
            return
        item = form['image']
        target = SLOTS[slot]['target']
        if os.path.exists(target) and os.path.getsize(target) > 0:
            backup = target + '.backup-' + time.strftime('%Y%m%d-%H%M%S')
            shutil.copy2(target, backup)
        with open(target, 'wb') as out:
            shutil.copyfileobj(item.file, out)
        git_output(['git', 'add', target])
        self.send_html(f'''<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{{background:#080504;color:#fff3de;font-family:system-ui;padding:22px}}a{{color:white;background:#b1130d;border:1px solid #d7a14f;border-radius:999px;padding:14px 16px;text-decoration:none;display:block;text-align:center;font-weight:900;margin-top:14px}}img{{max-width:100%;border-radius:14px;background:#111}}</style><h1>Uploaded</h1><p>{SLOTS[slot]['label']}</p><p><code>{SLOTS[slot]['public']}</code></p><img src="{SLOTS[slot]['public']}?cache={time.time()}"><a href="/">Upload Another Image</a><a href="/commit">Commit & Push</a>''')

    def do_HEAD(self):
        self.send_response(200)
        self.end_headers()

    def do_PUT(self):
        self.send_html('<h1>Use POST upload.</h1>', 405)

    def do_DELETE(self):
        self.send_html('<h1>Not supported.</h1>', 405)

    def do_PATCH(self):
        self.send_html('<h1>Not supported.</h1>', 405)

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def handle_one_request(self):
        return super().handle_one_request()

    def do_GET_commit(self):
        pass

    def do_POST_commit(self):
        pass

    def finish(self):
        return super().finish()

# Monkey patch commit route by wrapping do_GET above through a simple dispatch.
old_do_GET = Handler.do_GET

def routed_do_GET(self):
    if urlparse(self.path).path == '/commit':
        git_output(['git', 'add', 'public/menu/guarantee-menu.png', 'public/menu/premium-steak-box.png'])
        status = git_output(['git', 'status', '--short', 'public/menu'])
        if not status:
            body = '<h1>No image changes to commit</h1><p>Nothing changed in public/menu.</p><a href="/">Back</a>'
        else:
            commit = git_output(['git', 'commit', '-m', 'Add menu graphics from phone upload'])
            push = git_output(['git', 'push'])
            body = f'<h1>Committed & Pushed</h1><h2>Status</h2><pre>{status}</pre><h2>Commit</h2><pre>{commit}</pre><h2>Push</h2><pre>{push}</pre><a href="/">Back</a>'
        self.send_html('<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{background:#080504;color:#fff3de;font-family:system-ui;padding:22px}a{color:white;background:#b1130d;border:1px solid #d7a14f;border-radius:999px;padding:14px 16px;text-decoration:none;display:block;text-align:center;font-weight:900;margin-top:14px}pre{white-space:pre-wrap;background:#150d09;border:1px solid #d7a14f;border-radius:12px;padding:10px}</style>' + body)
    else:
        old_do_GET(self)

Handler.do_GET = routed_do_GET

port = int(os.environ.get('PORT', '8787'))
print(f'Phone upload portal running on port {port}')
print('In Codespaces, open the forwarded port in your browser.')
ThreadingHTTPServer(('0.0.0.0', port), Handler).serve_forever()
PY

echo ""
echo "Starting phone upload portal on port $PORT..."
echo ""
echo "NEXT STEP ON YOUR PHONE:"
echo "1) Open the Codespaces PORTS tab."
echo "2) Find port $PORT."
echo "3) Set visibility to Public if needed."
echo "4) Tap the globe / open-browser icon."
echo "5) Tap Choose File on the upload page to open your phone image picker."
echo ""
python3 .tmp/menu-phone-upload-server.py
