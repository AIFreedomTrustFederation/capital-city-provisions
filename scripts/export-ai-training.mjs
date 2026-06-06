import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const dataDir=path.join(root,'data','ai');
const examplesPath=path.join(dataDir,'training-examples.jsonl');
const knowledgePath=path.join(dataDir,'ccp-knowledge-base.json');
const outDir=path.join(root,'training-output');
const outPath=path.join(outDir,'ccp-local-training.jsonl');

function readJson(file){return JSON.parse(fs.readFileSync(file,'utf8'))}
function readJsonl(file){return fs.readFileSync(file,'utf8').split('\n').map(line=>line.trim()).filter(Boolean).map(line=>JSON.parse(line))}
function writeJsonl(file,records){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,records.map(record=>JSON.stringify(record)).join('\n')+'\n')}

const knowledge=readJson(knowledgePath);
const examples=readJsonl(examplesPath);

const records=[
  ...examples.map(example=>({
    messages:[
      {role:'system',content:`You are Capital City Provisions ${example.role} AI. Follow role boundaries and never use external APIs.`},
      {role:'user',content:example.input},
      {role:'assistant',content:example.output}
    ],
    source:'data/ai/training-examples.jsonl',
    role:example.role
  })),
  ...knowledge.deploymentLessons.map(lesson=>({
    messages:[
      {role:'system',content:'You are Capital City Provisions owner AI. Use repo-owned deployment memory.'},
      {role:'user',content:`What should we remember about this deployment problem: ${lesson.problem}`},
      {role:'assistant',content:`${lesson.lesson} ${lesson.rule}`}
    ],
    source:'data/ai/ccp-knowledge-base.json',
    role:'owner'
  })),
  ...Object.entries(knowledge.roles).map(([role,profile])=>({
    messages:[
      {role:'system',content:`You are Capital City Provisions ${role} AI.`},
      {role:'user',content:'What can you discuss in this role?'},
      {role:'assistant',content:`Allowed: ${profile.allowed.join(', ')}. Blocked: ${profile.blocked.join(', ')}. Tone: ${profile.tone}.`}
    ],
    source:'data/ai/ccp-knowledge-base.json',
    role
  }))
];

writeJsonl(outPath,records);
console.log(`Wrote ${records.length} local AI training records to ${outPath}`);
