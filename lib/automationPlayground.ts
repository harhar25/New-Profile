export type Platform = 'n8n' | 'ghl' | 'make' | 'zapier';
export type NodeKind = 'trigger' | 'filter' | 'tag' | 'email' | 'crm' | 'sheet';
export type WorkflowNode = { id: string; kind: NodeKind; label: string; value: string; x: number; y: number };
export type WorkflowEdge = { from: string; to: string };
export type SampleLead = { name: string; email: string; score: number; tags: string[] };
export type StepResult = { id: string; status: 'success' | 'skipped'; message: string; data: SampleLead | null };

export const platforms: { id: Platform; name: string; description: string }[] = [
  { id: 'n8n', name: 'n8n', description: 'A canvas of connected nodes. Start with a webhook and follow the data.' },
  { id: 'ghl', name: 'GoHighLevel', description: 'A contact journey, from form submission to a tagged lead and follow-up.' },
  { id: 'make', name: 'Make', description: 'Connected modules that pass a sample bundle from one operation to the next.' },
  { id: 'zapier', name: 'Zapier', description: 'A trigger followed by clear action steps, one small task at a time.' },
];

export const nodeTypes: Record<NodeKind, { title: string; subtitle: string; defaultValue: string; field: string }> = {
  trigger: { title: 'New lead', subtitle: 'Start with sample data', defaultValue: '', field: '' },
  filter: { title: 'Check lead score', subtitle: 'Continue above a threshold', defaultValue: '50', field: 'Minimum score (0–100)' },
  tag: { title: 'Add a tag', subtitle: 'Label the contact', defaultValue: 'Qualified lead', field: 'Contact tag' },
  email: { title: 'Send an email', subtitle: 'Preview a follow-up', defaultValue: 'Welcome, {{name}}!', field: 'Email subject · use {{name}}' },
  crm: { title: 'Update CRM', subtitle: 'Choose a pipeline stage', defaultValue: 'New opportunity', field: 'Pipeline stage' },
  sheet: { title: 'Add a sheet row', subtitle: 'Preview a reporting record', defaultValue: 'Lead tracker', field: 'Worksheet name' },
};

export function starterWorkflow(platform: Platform): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
  const vertical = platform === 'ghl' || platform === 'zapier';
  const kinds: NodeKind[] = platform === 'make' ? ['trigger', 'filter', 'tag', 'sheet'] : platform === 'ghl' ? ['trigger', 'tag', 'crm', 'email'] : ['trigger', 'filter', 'tag', 'email'];
  const nodes = kinds.map((kind, index) => ({ id: `step-${index + 1}`, kind, label: index === 0 ? platform === 'ghl' ? 'Form submitted' : platform === 'zapier' ? 'New form response' : 'Webhook received' : nodeTypes[kind].title, value: nodeTypes[kind].defaultValue, x: vertical ? 410 : 55 + index * 255, y: vertical ? 35 + index * 150 : 230 }));
  return { nodes, edges: nodes.slice(1).map((node, index) => ({ from: nodes[index].id, to: node.id })) };
}

export function connectionError(nodes: WorkflowNode[], edges: WorkflowEdge[], from: string, to: string): string | null {
  if (!nodes.some(node => node.id === from) || !nodes.some(node => node.id === to)) return 'Choose two existing nodes.';
  if (from === to) return 'A node cannot connect to itself.';
  if (nodes.find(node => node.id === to)?.kind === 'trigger') return 'The trigger is the first step and cannot receive a connection.';
  if (edges.some(edge => edge.from === from && edge.to === to)) return 'Those nodes are already connected.';
  if (edges.some(edge => edge.to === to)) return 'This step already has an input. Remove that connection first.';
  const seen = new Set<string>();
  const reaches = (id: string): boolean => {
    if (id === from) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return edges.filter(edge => edge.from === id).some(edge => reaches(edge.to));
  };
  return reaches(to) ? 'That connection would create a loop. Connect forward to another step.' : null;
}

export function simulateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[], input: SampleLead): StepResult[] {
  if (!input.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) throw new Error('Enter a name and a valid sample email address.');
  if (!Number.isFinite(input.score) || input.score < 0 || input.score > 100) throw new Error('The sample score must be between 0 and 100.');
  const trigger = nodes.find(node => node.kind === 'trigger');
  if (!trigger || nodes.filter(node => node.kind === 'trigger').length !== 1) throw new Error('The workflow needs exactly one trigger.');
  const checked: WorkflowEdge[] = [];
  for (const edge of edges) {
    const error = connectionError(nodes, checked, edge.from, edge.to);
    if (error) throw new Error(error);
    checked.push(edge);
  }
  const order: WorkflowNode[] = [];
  const visit = (id: string) => {
    const node = nodes.find(item => item.id === id);
    if (!node) return;
    order.push(node);
    edges.filter(edge => edge.from === id).forEach(edge => visit(edge.to));
  };
  visit(trigger.id);
  if (order.length !== nodes.length) throw new Error('Connect every node to the trigger before running the workflow.');
  const results = new Map<string, StepResult>();
  return order.map(node => {
    const parent = edges.find(edge => edge.to === node.id);
    const prior = parent ? results.get(parent.from)?.data ?? null : input;
    if (!prior) {
      const result: StepResult = { id: node.id, status: 'skipped', message: `${node.label}: skipped because its input was filtered out.`, data: null };
      results.set(node.id, result);
      return result;
    }
    const data = { ...prior, tags: [...prior.tags] };
    let message = '';
    if (node.kind !== 'trigger' && !node.value.trim()) throw new Error(`Configure ${node.label} before running.`);
    switch (node.kind) {
      case 'trigger': message = `Received sample lead: ${data.name} (${data.email}).`; break;
      case 'filter': {
        const minimum = Number(node.value);
        if (!Number.isFinite(minimum) || minimum < 0 || minimum > 100) throw new Error('Filter minimum must be a number from 0 to 100.');
        if (data.score < minimum) {
          const result: StepResult = { id: node.id, status: 'skipped', message: `Score ${data.score} is below ${minimum}; this branch stopped.`, data: null };
          results.set(node.id, result);
          return result;
        }
        message = `Score ${data.score} meets the minimum of ${minimum}.`; break;
      }
      case 'tag': data.tags = [...new Set([...data.tags, node.value.trim()])]; message = `Added tag: ${node.value.trim()}.`; break;
      case 'email': message = `Email preview to ${data.email}: “${node.value.replaceAll('{{name}}', data.name)}”.`; break;
      case 'crm': message = `CRM preview: ${data.name} → ${node.value}. Tags: ${data.tags.join(', ') || 'none'}.`; break;
      case 'sheet': message = `Row preview in ${node.value}: ${data.name} | ${data.email} | score ${data.score} | ${data.tags.join(', ')}.`; break;
    }
    const result: StepResult = { id: node.id, status: 'success', message, data };
    results.set(node.id, result);
    return result;
  });
}
