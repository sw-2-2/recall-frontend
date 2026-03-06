interface SideMenuProps {
  items: string[]
}

function SideMenu({ items }: SideMenuProps) {
  return (
    <aside className="side-menu">
      {items.map((item) => (
        <button key={item} type="button" className="side-menu__item">
          {item}
        </button>
      ))}
    </aside>
  )
}

export default SideMenu
