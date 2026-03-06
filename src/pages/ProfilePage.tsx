import PageFooter from '../components/PageFooter'
import SideMenu from '../components/SideMenu'
import TopBar from '../components/TopBar'

function ProfilePage() {
  return (
    <section className="screen">
      <TopBar />
      <div className="layout-body layout-body--grow">
        <SideMenu items={['초등학교', '중학교', '고등학교', '내 프로필']} />

        <main className="content content--profile">
          <section className="panel">
            <h3>내 프로필 수정</h3>
            <div className="profile-grid">
              <div className="avatar-block">
                <div className="avatar" />
                <button type="button">사진 변경</button>
              </div>

              <div className="profile-fields">
                <div>이름</div>
                <div>전화번호</div>
                <div>이메일</div>
                <div>지역</div>
              </div>
            </div>

            <div className="action-row">
              <button type="button">저장</button>
              <button type="button">취소</button>
            </div>
          </section>

          <section className="panel">
            <h3>학교 등록</h3>
            <p>내 동창을 찾으려면 내 학교를 등록하면 더 정확해요</p>

            <div className="school-form">
              <div className="school-form__row">
                <span>초등학교</span>
                <div className="lines">
                  <i />
                  <i />
                  <i />
                </div>
              </div>

              <div className="school-form__row">
                <span>중학교</span>
                <div className="lines">
                  <i />
                  <i />
                  <i />
                </div>
              </div>

              <div className="school-form__row">
                <span>고등학교</span>
                <div className="lines">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>

            <div className="action-row">
              <button type="button">저장</button>
              <button type="button">취소</button>
            </div>
          </section>

          <section className="panel panel--inline">
            <span>계정</span>
            <button type="button">로그아웃</button>
          </section>
        </main>
      </div>
      <PageFooter />
    </section>
  )
}

export default ProfilePage
