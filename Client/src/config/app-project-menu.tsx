

export const ProjectMenu = ()=>{
 
  return[
  { path: '/dashboard', icon: 'fas fa-sitemap', title: 'Dashboard' },
  { path: '/project', icon: 'fas fa-fw  fa-pen-to-square', title: 'Project' },
  {
    path: '/tests', icon: 'fas fa-fw  fa-pen-to-square', title: 'Design Tests',
    children: [
        { path: '/testsuites', icon:'fas fa-flask',title: 'Test Suites' },
    ]
  },
  { path: 'http://docs.automate-logic.com', icon:'fas fa-scroll', title: 'Docs' },
]
}

export default ProjectMenu;