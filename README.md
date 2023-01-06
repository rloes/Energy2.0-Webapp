# Energy 2.0 Webapplication
This is repository for the Webapplication of the [Energy 2.0 Application](https://github.com/s1n7/Energy2.0)
created in the context of the project seminar.

## Installation
1. Install node.js and npm
2. Clone the repository to your local machine   
`git clone git@github.com:rloes/Energy2.0-Webapp.git`
3. Change Directory to project root  
`cd Energy2.0-Webapp`
4. Install all dependencies  
`npm install`
5. Start developement server  
`npm start`

## Structure
The entry point is `src/App.js` where all routes are defined

- [Components](#components)
- [Hooks](#hooks)
- [Pages](#pages)
- [Stores](#stores)

### Components
All components that are shared over the entire application are stored 
here. If they require local hooks or style they can be stored in a dedicated folder with hooks and style subdirectories

Examples:
- WidgetComponent
- StyledButtons

### Hooks
All hooks that are shared over the entire application
Examples:
- useForm
- useApi

### Pages
All top-level components that are rendered as an own route get stored here.
They can be stored in a directory if they require local components, hooks or styles
Examples:
- AddProducer
- Login

### Stores
Global state is stored in Stores. We are using [zustand](https://github.com/pmndrs/zustand) for state management.
Examples:
- AuthorizationStore
- NotificationStore