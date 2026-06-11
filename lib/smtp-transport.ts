import type { EmailRecord } from './email-system';

export type SmtpSendResult={configured:boolean;ok:boolean;message:string;providerMessageId?:string;error?:string};

export function smtpReady(){return Boolean(process.env.SMTP_HOST&&process.env.SMTP_FROM)}
function port(){return Number(process.env.SMTP_PORT||587)}
function secure(){return String(process.env.SMTP_SECURE||'false').toLowerCase()==='true'||port()===465}
async function loadMailer(){const importer=new Function('moduleName','return import(moduleName)') as (moduleName:string)=>Promise<any>;return importer('nodemailer').catch(()=>null)}

export async function sendWithOptionalNodemailer(record:EmailRecord):Promise<SmtpSendResult>{
  if(!smtpReady())return {configured:false,ok:false,message:'SMTP is not configured. Message remains queued.'};
  try{
    const mod=await loadMailer();
    const createTransport=mod?.default?.createTransport||mod?.createTransport;
    if(!createTransport)return {configured:true,ok:false,message:'Nodemailer is not installed yet. Run npm install nodemailer @types/nodemailer and redeploy.'};
    const transporter=createTransport({host:process.env.SMTP_HOST,port:port(),secure:secure(),auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS||''}:undefined});
    const info=await transporter.sendMail({from:process.env.SMTP_FROM,to:record.customerEmail,subject:record.subject,text:record.body,replyTo:process.env.SMTP_REPLY_TO||process.env.SMTP_FROM});
    return {configured:true,ok:true,message:'Email sent through SMTP.',providerMessageId:String(info.messageId||'smtp-sent')};
  }catch(error:any){return {configured:true,ok:false,message:'SMTP send failed.',error:error?.message||String(error)}}
}
