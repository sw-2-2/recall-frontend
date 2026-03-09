import SchoolAdd from '../components/ui/SchoolAdd'
import SideMenu from '../components/ui/SideMenu'
import TopBar from '../components/ui/TopBar'
import favicon from '../assets/icons/jaewon-favicon.png'
import style from './styles/ProfilePage.module.css'


function ProfilePage() {
  return (
    <section>
      <div className="">
        <main className="">
          <form>
            <section className={style.sectionDivider}>
              <div>내 프로필 수정</div>
              <div className={style.profileEdit}>
                <span>
                  <img className={style.profilePhoto} src={favicon} />
                  <div>
                    <input type="file" accept='image/*' />
                  </div>
                </span>

                <span className="">
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
                </span>
              </div>
              <div className={style.saveProfile}>
                <button type="submit" value='saveProfile'>저장</button>
              </div>

            </section>
          </form>

          <section className={style.sectionDivider}>
            <h3>학교 등록</h3>
            <p>내 동창을 찾으려면 내 학교를 등록하면 더 정확해요</p>

            <div className={style.schoolResister}>
              <SchoolAdd name='초등학교' />
              <SchoolAdd name='중학교' />
              <SchoolAdd name='고등학교' />
            </div>

            <div className={style.saveProfile}>
              <button type="submit" value='schoolResister'>저장</button>
            </div>
          </section>

          <section className={style.sectionDivider}>
            <span>계정</span>
            <div className={style.saveProfile}>
              <button type="submit" value='logout'>로그아웃</button>
            </div>
          </section>
        </main>
      </div>
    </section>
  )
}

export default ProfilePage
