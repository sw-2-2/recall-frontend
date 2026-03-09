interface SideMenuProps {
  items: string[]
}

function SideMenu({ items }: SideMenuProps) {
  return (
    <aside className="sideMenu">
      {items.map((item) => (
        <button key={item} type="button" className="menuItem">
          {item}
        </button>
      ))}
    </aside>
  )
}

export default SideMenu
