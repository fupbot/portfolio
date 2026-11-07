export type Language = 'typescript' | 'python' | 'cpp' | 'jupyter'

export const languageLabels: Record<Language, string> = {
  typescript: 'TypeScript',
  python: 'Python',
  cpp: 'C++',
  jupyter: 'Jupyter Notebook',
}

export interface Project {
  name: string
  description: string
  languages: Language[]
  url: string
}

export const projects: Project[] = [
  {
    name: 'robot_ai_memory',
    description: 'OKF format memory for robots using ROS 2.',
    languages: ['python'],
    url: 'https://github.com/fupbot/robot_ai_memory',
  },
  {
    name: 'acontabill',
    description: 'Expenses sharing app with installments and local data only.',
    languages: ['typescript'],
    url: 'https://github.com/fupbot/acontabill',
  },
  {
    name: 'tapngo',
    description: 'Simple snack bar self service checkout.',
    languages: ['typescript', 'python'],
    url: 'https://github.com/fupbot/tapngo',
  },
  {
    name: 'ROSActiveExplorationCMP545',
    description: 'GUI for mapping environment as the robot moves around.',
    languages: ['cpp'],
    url: 'https://github.com/fupbot/ROSActiveExplorationCMP545',
  },
  {
    name: 'AutomaticPivotDetectorCMP197',
    description:
      'Computer vision program to find and analyze irrigation pivots with multispectral satellite imagery.',
    languages: ['jupyter'],
    url: 'https://github.com/fupbot/AutomaticPivotDetectorCMP197',
  },
  {
    name: 'AlgorithmsForHeartDiseaseCMP263',
    description:
      "Auxiliary data for reproducibility of the paper 'Comparative Analysis of Classification Algorithms for the Prediction of Heart Disease'.",
    languages: ['python'],
    url: 'https://github.com/fupbot/AlgorithmsForHeartDiseaseCMP263',
  },
]
