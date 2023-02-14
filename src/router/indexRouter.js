import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import login from '../views/login/login'
import News from '../views/news/News'
import Detail from '../views/news/Detail'
import NewsSandBox from '../views/sandbox/NewsSandBox'
export default function indexRouter() {
    return (
        <HashRouter>
            <Switch>
                <Route path='/login' component={login} />
                <Route path='/news' component={News} />
                <Route path='/detail/:id' component={Detail} />
                <Route path='/' render={() =>
                    <NewsSandBox />
                } />
            </Switch>
        </HashRouter>
    )
}
