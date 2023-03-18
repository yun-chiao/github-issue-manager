import axios from 'axios';
import { toast } from "react-toastify";

const client_id = process.env.REACT_APP_CLIENT_ID
const client_secret = process.env.REACT_APP_CLIENT_SECRET
const serverUrl = process.env.REACT_APP_SERVER_URL

export const getToken = async (code) => {
  try {
      const response = await axios.post(`${serverUrl}/login/oauth/access_token`, {
        client_id,
        client_secret,
        code
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('getToken',response.data)
      return response.data.access_token;
    } catch (error) {
      toast.success('登入失敗');
      console.error(error);
    }
}

export const getUser = async (token) => {
  try {
    const response = await axios.post(`${serverUrl}/user`, {
      token
    }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    toast.success(`嗨 ${response.data.login}！`);
    return response.data.login;
  } catch (error) {
    toast.success('登入失敗');
    console.error(error);
  }
}

export const getRepos = async (token, owner) => {
  try {
    const response = await axios.post(`${serverUrl}/repos`, {
      token,
      owner
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    toast.error('Server error');
    console.error(error);
  }
}

export const closeIssue = async (dispatch, issue_number, token, owner, repo) => {
  try {
    await axios.post(`${serverUrl}/close`, {
      token,
      owner,
      repo,
      issue_number
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    toast.success("成功關掉issue");
    dispatch({ type: 'REMOVE_ISSUE', payload: { closed_number: issue_number } });
  } catch (error) {
    toast.error('Server error');
    console.error(error);
  }
}

export const updateState = async (dispatch, issue_number, newState, labels, token, owner, repo, filterState) => {
  const states = ["Open", "Progressing", "Done"];
  let newLabels = [ {name: newState}, ...labels.filter( label => !states.includes(label.name))]

  try {
    await axios.post(`${serverUrl}/updateState`, {
      token,
      owner,
      repo,
      issue_number,
      labels: newLabels,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // If the [newState] is in the [filterState] the users checked, the IssueCard would change label.
    // Otherwise, it would be removed from issue list
    // By this way, it doesn't to call api and bring the slower experience or feel the view refreshing to users.
    if(filterState[newState]){
      dispatch({type: 'UPDATE_STATE', payload: { issue_number, labels: newLabels } })
    }else{
      dispatch({ type: 'REMOVE_ISSUE', payload: { closed_number: issue_number } })
    }
    toast.success("成功更新issue");
  } catch (error) {
    toast.error('Server error');
    console.error(error);
  }
}

export const createIssue = async (body, title, token, owner, repo, navigate) => {
  try {
    await axios.post(`${serverUrl}/createIssue`,{
        token,
        owner,
        repo,
        title,
        body,
        labels: ['Open'],
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );
    toast.success("成功新增issue");
    
    // To avoid the issue not be updated when the issue list get issues data.
    setTimeout(() => {
      navigate('/issues');
    },1000);
  } catch (error) {
    toast.error('Server error');
    console.error(error);
  }
}

export const UpdateIssue = async (issue_number, body, title, token, owner, repo, navigate) => {
  try {
    await axios.post(`${serverUrl}/updateIssue`, {
      token,
      owner,
      body,
      title,
      body,
      issue_number
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    toast.success("成功更新issue");

    // To avoid the issue not be updated when the issue list get issues data.
    setTimeout(() => {
      navigate('/issues');
    },1000);
  } catch (error) {
    toast.error('Server error');
    console.error(error);
  }
}

export const getIssue = async (issue_number, token, owner, repo) => {
  try {
    const response = await axios.post(`${serverUrl}/issue`, {
      token,
      owner,
      repo,
      issue_number
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Content-Type': 'application/json'
      },
    })
    return { title: response.data.title, body: response.data.body}
  } catch (error) {
    toast.error('Server error');
    console.error(error);
  }
}

export const getIssues = async (dispatch, labels, orderState, searchKey, token, owner, repo, page) => {
  let per_page = 10
  let labelsList = Object.keys(labels).filter((key) => labels[key])
  try {
    const labelsQuery = labelsList.map((label) => label).join(',');
    const response = await axios.post(`${serverUrl}/issues`, {
      token,
      owner,
      repo,
      per_page,
      page,
      labelsQuery,
      orderQuery: orderState.order,
      searchKey
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Content-Type': 'application/json'
      },
    })
    console.log(response.data.items)
    if(response.data.items.length < per_page){
      dispatch({ type: 'NON_HAS_MORE' })
    }else{
      dispatch({ type: 'HAS_MORE' })
    }
    if(page === 1){
      dispatch({ type: 'INIT_ISSUES', payload: { issues: response.data.items } })
    }else{
      dispatch({ type: 'UPDATE_ISSUES', payload: { issues: response.data.items } })
    }
  } catch (error) {
    toast.error('Server error');
    console.error(error);
  }
}