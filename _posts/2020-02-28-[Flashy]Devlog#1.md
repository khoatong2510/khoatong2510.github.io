---
layout: post
title: Flashy-Devlog#1
---

# [Flashy] Devlog #1 02-28-2020

Hi everyone, this is my first devlog on Flashy.

Flashy is an educational application which was ideated during my attempt to Code Network Winter Hackathon 2019. By randomly pushing notification related to lecture contents in students time, I believe Flashy can help them improve their memory on what they have learnt on classes.

In the Hackathon, we were not able to finish the app on time, however I have decided to complete it, and this devlog will capture the whole development process.

So far, the login and dashboard page has been reworked. 
<br>
<img src="{{ site.url }}/assets/login_screenshot.png" alt="loginscreenshot" width="600" />
<small>Login Screenshot</small>
<br>

One interesting technique I discovered while setup routes for login page is the private routes using `` `react-router-dom` `` package. By creating a context variable controlling authentication state, a route can be set as private by checking that context value.

First, I created an object ```AuthContext``` as context variable.

~~~ javascript

const authContextObj = {
    auth: false,
    login: () => {},
    logout: () => {}
};

const AuthContext = React.createContext(authContextObj);
~~~

Next, I config this context value by the App's state variable.
~~~ jsx

class App extends React.Component {
	constructor(props) {
		super(props);

		this.login = () => {
			this.setState(state => ({
				auth: true
			}));
		};

		this.logout = () => {
			this.setState(state => ({
				auth: false
			}));
		}
		
		this.state = {
			auth: false,
			authenticate: this.login,
			logout: this.logout
		};
	}

    render() {
		return (
			<div className="App">
				<AuthContext.Provider value={this.state}>
					<Router>
						<AuthContext.Consumer>
							{(authContext) => (
								<Route exact path="/login">
									<LoginForm onLogin={authContext.authenticate} />
								</Route>
							)}
						</AuthContext.Consumer>
						<PrivateRoute path="/" component={Dashboard} />
						<PrivateRoute path="/card_board" component={CardScreen} /> 
					</Router>
				</AuthContext.Provider>
			</div>
		);
	}
}
~~~

```Provider``` is a component which functions as a host for different components subscribe to context changes. The props ```value``` will be passes to all component's children. 
```Consumer``` is a subscriber to context changes. Therefore, in order to create private route, we need a consumer component which can subscribe to authentication state. The route will be rendered depending on the authentication state. For example, if the user has not logged in, the ```authContext.auth``` will be false. The app is then redirecting user to login page. After successfully loging in, the ```authContext.auth``` will true and the route will render the content component. 


~~~ jsx

function PrivateRoute({component: Component, ...rest}) {
	return (
		<AuthContext.Consumer>
			{(authContext) => <Route {...rest}
			render={(routeProps) => authContext.auth  ? <Component {...routeProps} />: 
			(<Redirect to="/login" />) }  />}
		</AuthContext.Consumer>
	);
}

~~~



<!-- <br>
<img src="/assets/dashboard_screenshot.png" alt="dashboardscreenshot" width="600" />
<small>Dashboard Screenshot</small> -->



