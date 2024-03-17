export default function useNavigation() {
  const navItems = [
    { name: 'Wisdoms', path: '/collections' },
    { name: 'Contribute', path: '/submissions/create' },
    // Add more navigation items here
  ]

  const dropdownItems = [
    { name: 'Dashboard', action: 'userdashboard' },
    { name: 'Settings', path: '/setting' },
    // Add more dropdown items here
  ]

  return { navItems, dropdownItems }
}
