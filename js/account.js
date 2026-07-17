import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './runtime-config.js';

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, detectSessionInUrl: true, flowType: 'pkce' }
});
const status = document.querySelector('#account-status');
const loginButton = document.querySelector('#account-login');
const controls = document.querySelector('#delete-controls');
const email = document.querySelector('#account-email');
const confirmation = document.querySelector('#delete-confirmation');
const deleteButton = document.querySelector('#delete-account');
const logoutButton = document.querySelector('#account-logout');

function showStatus(message, type = '') {
  status.textContent = message;
  status.className = `account-status${type ? ` is-${type}` : ''}`;
}

function renderSession(session) {
  const signedIn = Boolean(session?.user);
  loginButton.classList.toggle('hidden', signedIn);
  controls.classList.toggle('hidden', !signedIn);
  email.textContent = session?.user?.email || '';
  showStatus(signedIn ? '본인 인증이 완료됐습니다.' : '계정 삭제를 위해 Google 본인 인증이 필요합니다.');
}

loginButton.addEventListener('click', async () => {
  loginButton.disabled = true;
  showStatus('Google 로그인으로 이동합니다.');
  const redirectTo = new URL('delete-account.html', window.location.href).href;
  const { error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
  if (error) {
    showStatus('로그인을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.', 'error');
    loginButton.disabled = false;
  }
});

confirmation.addEventListener('input', () => {
  deleteButton.disabled = confirmation.value.trim() !== '삭제합니다';
});

logoutButton.addEventListener('click', async () => {
  await client.auth.signOut();
  confirmation.value = '';
  deleteButton.disabled = true;
  renderSession(null);
});

deleteButton.addEventListener('click', async () => {
  if (confirmation.value.trim() !== '삭제합니다') return;
  deleteButton.disabled = true;
  logoutButton.disabled = true;
  showStatus('계정과 개인정보를 삭제하고 있습니다.');
  const { error } = await client.rpc('delete_my_account');
  if (error) {
    showStatus('계정을 삭제하지 못했습니다. 앱에서 다시 시도하거나 고객지원으로 문의해 주세요.', 'error');
    deleteButton.disabled = false;
    logoutButton.disabled = false;
    return;
  }
  await client.auth.signOut({ scope: 'local' }).catch(() => {});
  controls.classList.add('hidden');
  loginButton.classList.add('hidden');
  showStatus('계정과 개인정보가 삭제됐습니다.', 'success');
});

const { data, error } = await client.auth.getSession();
if (error) showStatus('로그인 상태를 확인하지 못했습니다. 페이지를 새로고침해 주세요.', 'error');
else renderSession(data.session);
