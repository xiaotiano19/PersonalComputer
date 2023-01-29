import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import login from '../views/login/login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
export default function indexRouter() {
    return (
        <HashRouter>
            <Switch>
                <Route path='/login' component={login} />
                <Route path='/' render={() =>
                    <NewsSandBox />
                } />
            </Switch>
        </HashRouter>
    )
}
