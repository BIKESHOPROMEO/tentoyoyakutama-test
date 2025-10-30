function showLoading() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

function validateReservation(data) {
  const requiredFields = ['date', 'start', 'end', 'name', 'phone', 'email', 'carModel', 'workType'];
  for (const field of requiredFields) {
    if (!data[field] || data[field].trim() === '') {
      return `「${field}」が未入力です`;
    }
  }
  return null; // 問題なし
}

window.addEventListener('DOMContentLoaded', () => {
document.getElementById("submitBtn").addEventListener("click", async () => {
   showLoading();
  const resultEl = document.getElementById('result');

  const data = {
    action: "storeReservation",
    date: document.getElementById("dateInput").value,
    start: document.getElementById("startTime").value,
    end: document.getElementById("endTime").value,
    name: document.getElementById("customerName").value,
    phone: document.getElementById("phoneNumber").value.replace(/-/g, ''),
    email: document.getElementById("emailAddress").value,
    carModel: document.getElementById("vehicleModel").value,
    workType: document.getElementById("workType").value,
    note: document.getElementById("note").value,
  };  

  const errorMessage = validateReservation(data);
    if (errorMessage) {
      resultEl.textContent = errorMessage;
      resultEl.style.color = 'red';
      hideLoading();
      return; // ← 送信を止める！
  }

  try {
    const res = await fetch('/api/store-reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });   

    if (!res.ok) throw new Error('登録に失敗しました');
    const msg = await res.json();

    const confirmed = window.confirm('登録が完了しました。\nカレンダー画面に戻りますか？');
    if (confirmed) {
      window.location.href = 'https://calendar-ui-three.vercel.app/';
    }

    resultEl.style.color = 'green';
    document.getElementById('dateInput').value = '';
    document.getElementById('startTime').value = '10:00';
    document.getElementById('endTime').value = '10:00';
    document.getElementById('customerName').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('emailAddress').value = '';
    document.getElementById('vehicleModel').value = '';
    document.getElementById('workType').value = '';
    document.getElementById('note').value = '';
  } catch (err) {
    console.error('登録エラー:', err);
    resultEl.textContent = '登録に失敗しました';
    resultEl.style.color = 'red';
  } finally {
    hideLoading();
  }
});
});