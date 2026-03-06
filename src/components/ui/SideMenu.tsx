interface SideMenuProps {
  items: string[]
}

function SideMenu({ items }: SideMenuProps) {
  return (
    <aside className="">
      {items.map((item) => (
        <button key={item} type="button" className="">
          {item}
        </button>
      ))}
    </aside>
  )
}

export default SideMenu
