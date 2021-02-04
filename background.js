let state = {
  recent: null,
  active: null
}

const update = (nextState) => {
  state = {...state, ...nextState};
}

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  const activeTab = tabs[0].id;
  update({active: activeTab});
  chrome.tabs.onActivated.addListener((activeInfo) => {
    const newTab = activeInfo.tabId;
    update({recent: state.active, active: newTab})
  });
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== 'switch-tab') {
    return;
  }
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const activeTab = tabs[0]?.id;
    if (!activeTab) {
      return;
    }
    chrome.tabs.update(state.recent, {active: true});
  });
});
