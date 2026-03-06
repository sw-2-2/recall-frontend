import SchoolAdd from '../components/ui/SchoolAdd'
import SideMenu from '../components/ui/SideMenu'
import TopBar from '../components/ui/TopBar'
import favicon from '../assets/icons/jaewon-favicon.png'



function ProfilePage() {
  return (
    <section className="">
      <TopBar />
      <div className="">
        <SideMenu items={['초등학교', '중학교', '고등학교', '내 프로필']} />

        <main className="">
          <form>
            <section className="">
              <h3>내 프로필 수정</h3>
              <div className="">
                <div className="">
                  <div className="" />
                  <img src={favicon} style={{ width: '100px' }} /> {/* 기존 DB에 등록된 이미지를 가져올 수 있도록 로직 구성 필요 */}

                  <div>
                    <input type="file" accept='image/*' />{/* 이미지만 받을 수 있게 함 */}
                  </div> 
                </div>

                <div className="">
                  <div>
                    이름 :
                    <input type='text' id='name' placeholder='이름을 입력해주세요.'></input>
                  </div>
                  <div>
                    전화번호 :
                    <input type='number' id='phone' placeholder='전화번호를 입력해주세요.'></input>
                  </div>
                  <div>
                    이메일 :
                    <input type='email' id='email' placeholder='이메일을 입력해주세요.'></input>
                  </div>
                  <div>
                    지역 :
                    <input type='text' id='region' placeholder='지역을 입력해주세요.'></input>
                  </div>
                </div>
              </div>

              <div className="">
                <button type="submit">저장</button>
              </div>
            </section>
          </form>

          <section className="">
            <h3>학교 등록</h3>
            <p>내 동창을 찾으려면 내 학교를 등록하면 더 정확해요</p>

            <div className="">
              <SchoolAdd name='초등학교' />
              <SchoolAdd name='중학교' />
              <SchoolAdd name='고등학교' />
            </div>

            <div className="">
              <button type="submit">저장</button>
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
