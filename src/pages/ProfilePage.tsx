import SchoolAdd from '../components/ui/SchoolAdd'
import SideMenu from '../components/ui/SideMenu'
import TopBar from '../components/ui/TopBar'

function ProfilePage() {
  return (
    <section className="">
      <TopBar />
      <div className="">
        <SideMenu items={['초등학교', '중학교', '고등학교', '내 프로필']} />

        <main className="">
          <section className="">
            <h3>내 프로필 수정</h3>
            <div className="">
              <div className="">
                <div className="" />
                <button type="button">사진 변경</button>
              </div>

              <div className="">
                <div>이름</div>
                <div>전화번호</div>
                <div>이메일</div>
                <div>지역</div>
              </div>
            </div>

            <div className="">
              <button type="button">저장</button>
              <button type="button">취소</button>
            </div>
          </section>

          <section className="">
            <h3>학교 등록</h3>
            <p>내 동창을 찾으려면 내 학교를 등록하면 더 정확해요</p>

            <div className="">
              <SchoolAdd name='초등학교' />
              <SchoolAdd name='중학교' />
              <SchoolAdd name='고등학교' />
            </div>

            <div className="">
              <button type="button">저장</button>
              <button type="button">취소</button>
            </div>
          </section>

          <section className="">
            <span>계정</span>
            <button type="button">로그아웃</button>
          </section>
        </main>
      </div>
    </section>
  )
}

export default ProfilePage
