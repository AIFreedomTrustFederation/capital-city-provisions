export type AiMemoryRole='customer'|'driver'|'owner';
export type AiMemoryMessage={role:'user'|'assistant'|'system';content:string;metadata?:Record<string,unknown>};

export async function saveAiExchange(input:{role:AiMemoryRole;sessionId:string;title:string;subjectKey?:string;messages:AiMemoryMessage[];context?:Record<string,unknown>}){
  try{
    await fetch('/api/ai-memory',{
      method:'POST',
      credentials:'same-origin',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        action:'save-exchange',
        session:{id:input.sessionId,role:input.role,title:input.title,subjectKey:input.subjectKey||input.role,metadata:{source:'ai-chat',context:input.context||{}}},
        messages:input.messages
      })
    });
  }catch{
    // AI memory must never break the chat experience.
  }
}
