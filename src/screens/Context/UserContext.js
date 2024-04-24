import React, {createContext, Component} from 'react';

export const UserContext = createContext();

class UserContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherData: {},
    };
  }

  setTeacherData = (data) => {
    this.setState({
      teacherData: data,
    });
  };
  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          setTeacherData: this.setTeacherData,
        }}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserContextProvider;
