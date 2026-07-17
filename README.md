# 모솔팅 소개 웹사이트

모태솔로 전용 소개팅 앱 **모솔팅**의 소개·정책·고객지원 웹사이트입니다. 빌드 과정 없이 GitHub Pages에 바로 배포할 수 있습니다.

## 로컬 확인

```powershell
cd C:\Users\dlfgn\Desktop\mosolting-web
python -m http.server 4173
```

브라우저에서 `http://localhost:4173`으로 접속합니다.

## GitHub에 올리기

GitHub에서 빈 `mosolting-web` 저장소를 만든 뒤 실행합니다.

```powershell
git init
git add .
git commit -m "Create Mosolting landing page"
git branch -M main
git remote add origin https://github.com/ilhoonseo/mosolting-web.git
git push -u origin main
```

저장소의 `Settings > Pages`에서 `Deploy from a branch`, `main`, `/ (root)`를 선택하면 아래 주소로 배포됩니다.

```text
https://mosolting.com/
```

저장소 이름이나 GitHub 계정이 달라지면 `index.html`, `robots.txt`, `sitemap.xml`의 공개 URL을 실제 주소로 변경합니다.

## 공개 문서

- `terms.html` 이용약관
- `privacy.html` 개인정보처리방침
- `safety.html` 아동 안전 및 커뮤니티 기준
- `delete-account.html` Google 본인 인증 기반 계정 삭제
- `support.html` 고객지원 및 개인정보 문의

웹 계정 삭제 로그인을 사용하려면 Supabase Authentication의 Redirect URLs에 다음 주소를 등록해야 합니다.

```text
https://mosolting.com/delete-account.html
```

`js/runtime-config.js`에는 브라우저 공개용 Supabase publishable key만 둡니다. `service_role` 키는 절대 저장하지 않습니다.

계정 삭제 페이지는 외부 CDN 요청을 줄이기 위해 `@supabase/supabase-js`의 UMD 배포본을 `js/vendor/`에 고정해 사용합니다. 라이선스는 같은 폴더의 `LICENSE.supabase-js.txt`에 있습니다.
