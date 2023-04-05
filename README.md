## Website
https://github-issue-manager.up.railway.app

## 啟動步驟
1. clone 這個 repo
2. cd github-issue-manager/my-app 到my-app資料夾
3. git checkout dev 切到 dev branch
4. npm install
5. 到 https://github.com/settings/developers 註冊一個 github oauth app\
Application name 任意填\
Homepage URL 以及 Authorization callback URL 皆填入 http://localhost:3000/ \
創建好之後要生成Client secrets\
記下 Client ID 以及 Client secrets 以供下一步驟使用
6. 在my-app資料夾下新增.env檔案 \
.env檔的內容如下： \
REACT_APP_CLIENT_ID = "your client id" \
REACT_APP_CLIENT_SECRET = "your client secret" \
REACT_APP_SERVER_URL = "https://manager-proxy-server-production.up.railway.app" 
7. npm start 即可使用

## 架構設計 
### 採取組件邏輯資料分離，並使用typescript。 
src \
|- component/ 用來放所有可重複使用的組件\
|- hook/    給組件提供服務，並控制是否 loading 結束\
|- pages/   用來存放所有頁面組件\
|- reducer/  用來定義有關儲存資料變更的動作\
|- store/   Reducers 的接口\
|- App.tsx  \
|- index.tsx\
|- service.ts 用來放所有與 API 有關的服務\
|- type.ts 用來定義所需要的 type

## Error 
1. 若是接server有問題(deploy平台偶爾會壞掉)，可以clone https://github.com/yun-chiao/manager-proxy-server，然後輸入node index.js啟動server，
並把.env檔案中更改 REACT_APP_SERVER_URL =  "http://localhost:5000"來使用 local 的 server。 

## FQA
1. 為神麼不要deploy main branch, 要分兩個branch? => 因為轉tsx之後，deploy平台免費版沒提供那麼大的記憶體，所以就只能deploy轉換之前的，也就是main分支，而dev則是最新版。
2. 為神麼中間要多一層proxy-server? => 因為 github API 回傳過不了CORS檢查，所以通過自己的小伺服器去冠上header，但速度就比較慢。

## 使用說明 (以 dev branch 為主)
1. 使用 login 登入 github 帳號
2. 按 click button 選擇 repo
3. 進入的主頁面會是該repo中的所有issues，而他們會被分為三種狀態，若沒有這三種狀態內的label的話，一律被標為Open(只在此顯示，不會自動加入open進你的label)
4. 往下拉可發現每次捲到底會新增10個issues
5. 上方filter可使用狀態、新舊順序或是關鍵字過慮，若是先跳到別的頁面再回來，過慮條件會維持被你設定過的，而關鍵字會維持上次搜尋時的狀態。
6. 可點選issue的標題或內容或是edit icon進入編輯狀態，只要點選標題或內容就可以預覽更改，按提交就可以更改到github。
7. 可點選issue的垃圾桶icon來關閉該issue，此時這個issue會從畫面上消失，但不會觸發refresh。
8. 可點選issue左上角的狀態來更新狀態，此時這個issue狀態會更新，但不會觸發refresh。
9. 可再右上角點選+，來進入新增issue的頁面，送出時會自動加上Open的label。
10. 可點選右邊的 Select repos 按鈕來重回選取repo的頁面 or 可點選右邊的 Logout 按鈕來登出（會清除相關cookies）