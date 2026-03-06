interface TopBarProps {
  searchPlaceholder?: string
  photoLabel?: string
}

function TopBar({
  searchPlaceholder = '학교 이름 검색',
  photoLabel = '사진: 이름',
}: TopBarProps) {
  return (
    <header className="top-bar">
      <div className="top-bar__status">초/중/고 동창찾기</div>
      <div className="top-bar__search">{searchPlaceholder}</div>
      <div className="top-bar__photo">{photoLabel}</div>
    </header>
  )
}

export default TopBar
