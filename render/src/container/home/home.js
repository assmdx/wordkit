import React from 'react'
import { connect} from 'react-redux'

let clock = null

@connect(
    state=>state.hint,
    {}
)
class Home extends React.Component {
    state={
        index:0
    }

    render(){
        const {words,freshTimer} = this.props
        const {index} = this.state
        const word = words ? words[index] : "hello"

        clock = setInterval(()=>{
            this.setState({
                index:(this.state.index + 1) % words.length
            })
        },freshTimer)

        return <h1>{word}</h1>
    }

    componentWillUnmount(){
        clearInterval(clock)
    }
}

export default Home
