const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content
        part1={part1}
        exercises1={exercises1}
        part2={part2}
        exercises2={exercises2}
        part3={part3}
        exercises3={exercises3}
      />
      <Total a={exercises1} b={exercises2} c={exercises3} />
    </div>
  )
}

const Header = (props) => {
  console.log(props)

  return (
    <div>
      <h1>
        {props.course}
      </h1>
    </div>
  )
}

const Content = (props) => {
  console.log(props)

  return (
    <div>
      <Part part={props.part1} exercises={props.exercises1} />
      <Part part={props.part2} exercises={props.exercises2} />
      <Part part={props.part3} exercises={props.exercises3} />
    </div>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  )
}

const Total = (props) => {
  console.log(props)

  return(
    <div>
      <p>
      Number of exercises {props.a + props.b + props.c}
      </p>
    </div>
  )
}



/*
Unfortunately, the entire application is in the same component. Refactor the code so that it consists of three new components: 
Header, Content, and Total. 
All data still resides in the App component, which passes the necessary data to each component using props. 
Header takes care of rendering the name of the course, Content renders the parts and their number of exercises and
 Total renders the total number of exercises.



const App = () => {
  // const-definitions

  return (
    <div>
      <Header course={course} />
      <Content ... />
      <Total ... />
    </div>
  )
}
*/

export default App