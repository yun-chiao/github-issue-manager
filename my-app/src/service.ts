import axios from "axios";
import { toast } from "react-toastify";
import { Dispatch } from "redux";

import { FilterOrder, FilterState, Issue, Label } from "./type";

const client_id = process.env.REACT_APP_CLIENT_ID
const client_secret = process.env.REACT_APP_CLIENT_SECRET
const serverUrl = process.env.REACT_APP_SERVER_URL

/// Get token from GitHub authorizing API.
export const getToken = async (code: string): Promise<string> => {
  try {
    const response = await axios.post(`${serverUrl}/login/oauth/access_token`, {
      client_id,
      client_secret,
      code
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data.access_token;
  } catch (error) {
    toast.error("登入失敗");
    console.error(error);
  }
}

/// Get user information from GitHub API.
export const getUser = async (token: string): Promise<string> => {
  try {
    const response = await axios.post(`${serverUrl}/user`, {
      token
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    }
    );
    toast.success(`嗨 ${response.data.login}!`);
    return response.data.login;
  } catch (error) {
    toast.error("登入失敗");
    console.error(error);
  }
}

/// Get all the repos of user from GitHub API.
export const getRepos = async (token: string): Promise<any> => {
  try {
    const response = await axios.post(`${serverUrl}/repos`, {
      token
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    toast.error("Server error");
    console.error(error);
  }
}

/// Call GitHub API to close certain issue.
export const closeIssue = async (
  dispatch: Dispatch,
  issue_number: number | string,
  token: string,
  owner: string,
  repo: string
): Promise<void> => {
  try {
    await axios.post(`${serverUrl}/close`, {
      token,
      owner,
      repo,
      issue_number
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    toast.success("成功關掉issue");
    dispatch({
      type: "REMOVE_ISSUE", payload: {
        closed_number: issue_number
      }
    });
  } catch (error) {
    toast.error("Server error - 關閉失敗");
    console.error(error);
  }
}

/// Call GitHub API to update the statelike 'Open', 'Progress', 'Done'.
export const updateState = async (
  dispatch: Dispatch,
  issue_number: number | string,
  newState: string,
  labels: Label[],
  token: string,
  owner: string,
  repo: string,
  filterState: FilterState
): Promise<void> => {
  const states = ["Open", "Progressing", "Done"];
  // Delete the state label and add new state label into label.
  // Filter to avoid effect others non-state label.
  const newLabels = [{
    name: newState
  }, ...labels.filter(label => !states.includes(label.name))]

  try {
    await axios.post(`${serverUrl}/updateState`, {
      token,
      owner,
      repo,
      issue_number,
      labels: newLabels,
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    // If the [newState] is in the [filterState] the users checked, the IssueCard would change label.
    // Otherwise, it would be removed from issue list
    // By this way, it doesn't to call api and bring the slower experience or feel the view refreshing to users.
    if (filterState[newState]) {
      dispatch({
        type: "UPDATE_STATE", payload: {
          issue_number, labels: newLabels
        }
      })
    } else {
      dispatch({
        type: "REMOVE_ISSUE", payload: {
          closed_number: issue_number
        }
      })
    }

    toast.success("成功更新issue");
  } catch (error) {
    toast.error("Server error - 更新失敗");
    console.error(error);
  }
}

/// Call GitHub API to create the issue, and give it the 'Open' label automatically.
export const createIssue = async (
  body: string,
  title: string,
  token: string,
  owner: string,
  repo: string
): Promise<void> => {
  try {
    await axios.post(`${serverUrl}/createIssue`, {
      token,
      owner,
      repo,
      title,
      body,
      labels: ["Open"],
    },
      {
        headers: {
          "Content-Type": "application/json"
        },
      }
    );
    toast.success("成功新增issue");

  } catch (error) {
    toast.error("Server error - 新增失敗");
    console.error(error);
  }
}

/// Call GitHub API to update the issue's body and title.
export const UpdateIssue = async (
  issue_number: number | string,
  body: string,
  title: string,
  token: string,
  owner: string,
  repo: string
): Promise<void> => {
  try {
    await axios.post(`${serverUrl}/updateIssue`, {
      token,
      owner,
      body,
      repo,
      title,
      issue_number
    }, {
      headers: {
        "Content-Type": "application/json"
      },
    });
    toast.success("成功更新issue");

  } catch (error) {
    toast.error("Server error - 更新失敗");
    console.error(error);
  }
}

/// Call GitHub API to get the certain issue data.
export const getIssue = async (
  issue_number: number | string,
  token: string,
  owner: string,
  repo: string
): Promise<Issue> => {
  try {
    const response = await axios.post(`${serverUrl}/issue`, {
      token,
      owner,
      repo,
      issue_number
    }, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Content-Type": "application/json"
      },
    })
    return response.data
  } catch (error) {
    toast.error("Server error - 抓取資料失敗");
    console.error(error);
  }
}

/// Call GitHub API to fetch issues data.
/// It wold return 10 issues at once and filter by filter condition like order, state, keyword.
/// The related info can be found at ./reducer/filter.ts.
export const getIssues = async (
  dispatch: Dispatch,
  labelsState: FilterState,
  orderState: FilterOrder,
  searchKey: string,
  token: string,
  owner: string,
  repo: string,
  page: number
): Promise<void> => {
  const per_page = 10
  let labelsQuery = "";

  // If Open is true, it need to choose the issue with open state, and the issue without any state.
  if (labelsState["Open"] == true) {
    const labelsList = Object.keys(labelsState).filter(key => labelsState[key] === false);
    labelsQuery = `-label:${labelsList.map(label => label).join(",")}`;
  } else {
    const labelsList = Object.keys(labelsState).filter(key => labelsState[key]);
    labelsQuery = `label:${labelsList.map(label => label).join(",")}`;
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
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "Content-Type": "application/json"
      },
    })

    // It doesn't has more issues if the return items less than [per_page].
    if (response.data.items.length < per_page) {
      dispatch({
        type: "NON_HAS_MORE"
      })
    } else {
      dispatch({
        type: "HAS_MORE"
      })
    }

    // Whether it is be refreshed or just need to fetch more issues.
    if (page === 1) {
      dispatch({
        type: "INIT_ISSUES", payload: {
          issues: response.data.items
        }
      })
    } else {
      dispatch({
        type: "UPDATE_ISSUES", payload: {
          issues: response.data.items
        }
      })
    }
  } catch (error) {
    toast.error("Server error - 抓取資料失敗");
    console.error(error);
  }
}