import { GetStaticProps } from 'next'
import style from '../styles/Profile.module.css'
import fs from 'fs'

export const getStaticProps: GetStaticProps = async () => {
  const profile = fs.readFileSync('./posts/profile.md', 'utf8');

  const selfIntro = profile.match(/## Self Introduction\n(.*)/);
  const acaPerf = profile.match(/## Academic Performance\n([\d\D]*)\n- A\+ Courses/);
  const aPlus = profile.match(/- A\+ Courses\n([\d\D]*)\n- A Courses/);
  const a = profile.match(/- A Courses\n([\d\D]*)\n\n## Projects/);
  const projects = profile.match(/## Projects\n- ([\d\D]*)\n## Competitions/);
  const competitions = profile.match(/## Competitions\n([\d\D]*)\n\n## Interests/);
  const interests = profile.match(/## Interests\n([\d\D]*)$/);
  return {
    props: {
      selfIntro: selfIntro[1],
      acaPerf: acaPerf[1].replaceAll('- ', '').split('\n'),
      aPlus: aPlus[1].replaceAll('    - ', '').split('\n'),
      a: a[1].replaceAll('    - ', '').split('\n'),
      projects: projects[1].split('\n\n- '),
      competitions: competitions[1].replaceAll('- ', '').split('\n'),
      interests: interests[1].replaceAll('- ', '').split('\n'),
    }
  }
}

export default function Profile(props) {
  return (
    <div className={style.main}>
      <div className={style.card}>
        <h2 className={style.title}>Self Introduction</h2>
        <p>
          {props.selfIntro}
        </p>
      </div>
      <div className={style.card}>
        <h2 className={style.title}>Academic Performance</h2>
        <ul className={style.list}>
          {props.acaPerf.map((item: string) => {
            return <li key={item}>{item}</li>
          })}
        </ul>
      </div>
      <div className={style.card}>
        <h2 className={style.title}>A+ Courses</h2>
        <ul className={style.list}>
          {props.aPlus.map((item: string) => {
            return <li key={item}>{item}</li>
          })}
        </ul>
      </div>
      <div className={style.card}>
        <h2 className={style.title}>A Courses</h2>
        <ul className={style.list}>
          {props.a.map((item: string) => {
            return <li key={item}>{item}</li>
          })}
        </ul>
      </div>
      <div className={style.card}>
        <h2 className={style.title}>Projects</h2>
        <ul className={style.list}>
          {props.projects.map((item: string) => {
            const content = item.split('\n\n    ');
            return (
              <li key={item}>
                <b>{content[0]}</b><br />
                {content[1]}
              </li>
            )
          })}
        </ul>
      </div>
      <div className={style.card}>
        <h2 className={style.title}>Competitions</h2>
        <ul className={style.list}>
          {props.competitions.map((item: string) => {
            return <li key={item}>{item}</li>
          })}
        </ul>
      </div>
      <div className={style.card}>
        <h2 className={style.title}>Interests</h2>
        <ul className={style.list}>
          {props.interests.map((item: string) => {
            return <li key={item}>{item}</li>
          })}
        </ul>
      </div>
    </div>
  )
}
