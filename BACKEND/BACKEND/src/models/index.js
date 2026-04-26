// Data models / mock data for Sandy Lab Management System

export const LabStatus = {
  ONLINE:  'online',
  OFFLINE: 'offline',
  BUSY:    'busy',
}

export const ExperimentStatus = {
  RUNNING:   'running',
  COMPLETED: 'completed',
  FAILED:    'failed',
  PAUSED:    'paused',
}

export const ProjectStatus = {
  ACTIVE:   'active',
  PAUSED:   'paused',
  DONE:     'done',
  ARCHIVED: 'archived',
}

// Factory helpers (replace with real API data)
export function createProject(overrides = {}) {
  return {
    id:       Date.now(),
    name:     'New Project',
    lead:     'Sandy Cheeks',
    status:   ProjectStatus.ACTIVE,
    phase:    'R&D',
    progress: 0,
    due:      '',
    tags:     [],
    desc:     '',
    ...overrides,
  }
}

export function createExperiment(overrides = {}) {
  return {
    id:       `EXP-${String(Date.now()).slice(-3)}`,
    name:     'New Experiment',
    project:  '',
    status:   ExperimentStatus.RUNNING,
    date:     new Date().toISOString().split('T')[0],
    duration: '—',
    lead:     'Sandy Cheeks',
    result:   '⏳ In progress…',
    notes:    '',
    ...overrides,
  }
}

export function createInventoryItem(overrides = {}) {
  return {
    id:       Date.now(),
    name:     '',
    cat:      'Chemicals',
    qty:      0,
    unit:     'g',
    min:      10,
    location: 'TBD',
    cost:     0,
    ...overrides,
  }
}
