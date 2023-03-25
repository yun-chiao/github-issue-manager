import axios from 'axios';
import { toast } from "react-toastify";
import { Dispatch } from "redux";
import { Label, FilterState, FilterOrder, Issue } from './type';
import { NavigateFunction } from "react-router-dom";

const client_id = process.env.REACT_APP_CLIENT_ID
const client_secret = process.env.REACT_APP_CLIENT_SECRET
const serverUrl = process.env.REACT_APP_SERVER_URL

export const getToken = async (code: string): Promise<string> => {
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
    return response.data.access_token;
  } catch (error) {
    toast.error('登入失敗');
    console.error(error);
  }
}

export const getUser = async (token: string): Promise<string> => {
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
    toast.error('登入失敗');
    console.error(error);
  }
}

export const getRepos = async (token: string): Promise<any> => {
  try {
    const response = await axios.post(`${serverUrl}/repos`, {
      token
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

export const closeIssue = async (dispatch: Dispatch, issue_number: number | string, token: string, owner: string, repo: string): Promise<void> => {
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

export const updateState = async (dispatch: Dispatch, issue_number: number | string, newState: string, labels: Label[], token: string, owner: string, repo: string, filterState: FilterState): Promise<void> => {
  const states = ["Open", "Progressing", "Done"];
  const newLabels = [{ name: newState }, ...labels.filter(label => !states.includes(label.name))]

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
    if (filterState[newState]) {
      dispatch({ type: 'UPDATE_STATE', payload: { issue_number, labels: newLabels } })
    } else {
      dispatch({ type: 'REMOVE_ISSUE', payload: { closed_number: issue_number } })
    }
    toast.success("成功更新issue");
  } catch (error) {
    toast.error('Server error');
    console.error(error);
  }
}

export const createIssue = async (body: string, title: string, token: string, owner: string, repo: string, navigate: NavigateFunction): Promise<void> => {
  try {
    await axios.post(`${serverUrl}/createIssue`, {
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
    }, 1000);
  } catch (error) {
    toast.error('Server error');
    console.error(error);
  }
}

export const UpdateIssue = async (issue_number: number | string, body: string, title: string, token: string, owner: string, repo: string, navigate: NavigateFunction): Promise<void> => {
  try {
    const response = await axios.post(`${serverUrl}/updateIssue`, {
      token,
      owner,
      body,
      repo,
      title,
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
    }, 1000);
  } catch (error) {
    toast.error('Server error');
    console.error(error);
  }
}

export const getIssue = async (issue_number: number | string, token: string, owner: string, repo: string): Promise<Issue> => {
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
    return response.data
  } catch (error) {
    toast.error('Server error');
    console.error(error);
  }
}

export const getIssues = async (dispatch: Dispatch, labelsState: FilterState, orderState: FilterOrder, searchKey: string, token: string, owner: string, repo: string, page: number): Promise<void> => {
  const per_page = 10
  let labelsQuery = '';
  if (labelsState['Open'] == true) {
    const labelsList = Object.keys(labelsState).filter(key => labelsState[key] === false);
    labelsQuery = `-label:${labelsList.map(label => label).join(',')}`;
  } else {
    const labelsList = Object.keys(labelsState).filter(key => labelsState[key]);
    labelsQuery = `label:${labelsList.map(label => label).join(',')}`;
  }
  try {
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
    if (response.data.items.length < per_page) {
      dispatch({ type: 'NON_HAS_MORE' })
    } else {
      dispatch({ type: 'HAS_MORE' })
    }
    if (page === 1) {
      dispatch({ type: 'INIT_ISSUES', payload: { issues: response.data.items } })
    } else {
      dispatch({ type: 'UPDATE_ISSUES', payload: { issues: response.data.items } })
    }
  } catch (error) {
    toast.error('Server error');
    console.error(error);
  }
}