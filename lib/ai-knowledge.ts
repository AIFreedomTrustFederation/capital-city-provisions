import ccpKnowledgeBase from '../data/ai/ccp-knowledge-base.json';

export type AiRole='customer'|'driver'|'owner';

type KnowledgeBase=typeof ccpKnowledgeBase;

export const aiKnowledgeBase:KnowledgeBase=ccpKnowledgeBase;

export function buildKnowledgeContext(role:AiRole){
  const roleKnowledge=aiKnowledgeBase.roles[role];
  return {
    version:aiKnowledgeBase.version,
    principles:aiKnowledgeBase.principles,
    role,
    roleKnowledge,
    routeLearningSignals:role==='owner'?aiKnowledgeBase.routeLearningSignals:[],
    ownerRules:role==='owner'?aiKnowledgeBase.ownerRules:[],
    deploymentLessons:role==='owner'?aiKnowledgeBase.deploymentLessons:[]
  };
}

export function deploymentMemory(){
  return aiKnowledgeBase.deploymentLessons.map(lesson=>`${lesson.problem} ${lesson.lesson} ${lesson.rule}`).join(' ');
}
