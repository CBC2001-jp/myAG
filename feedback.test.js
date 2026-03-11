const { initFeedback } = require('./feedback');

function setupDOM() {
  document.body.innerHTML = `
    <button id="feedbackBtn">フィードバック</button>
    <div id="feedbackModal">
      <div class="feedback-modal-content">
        <button id="feedbackClose">&times;</button>
        <form id="feedbackForm">
          <button type="button" class="rating-btn" data-value="1">😞</button>
          <button type="button" class="rating-btn" data-value="2">😐</button>
          <button type="button" class="rating-btn" data-value="3">😊</button>
          <button type="submit">送信する</button>
        </form>
        <div id="feedbackThanks" hidden></div>
      </div>
    </div>
  `;

  return initFeedback({
    feedbackBtn: document.getElementById('feedbackBtn'),
    feedbackModal: document.getElementById('feedbackModal'),
    feedbackClose: document.getElementById('feedbackClose'),
    feedbackForm: document.getElementById('feedbackForm'),
    feedbackThanks: document.getElementById('feedbackThanks'),
  });
}

describe('Feedback modal', () => {
  let feedback;

  beforeEach(() => {
    feedback = setupDOM();
  });

  test('openModal adds active class to modal', () => {
    feedback.openModal();
    expect(document.getElementById('feedbackModal').classList.contains('active')).toBe(true);
  });

  test('closeModal removes active class from modal', () => {
    feedback.openModal();
    feedback.closeModal();
    expect(document.getElementById('feedbackModal').classList.contains('active')).toBe(false);
  });

  test('clicking feedback button opens modal', () => {
    document.getElementById('feedbackBtn').click();
    expect(document.getElementById('feedbackModal').classList.contains('active')).toBe(true);
  });

  test('clicking close button closes modal', () => {
    feedback.openModal();
    document.getElementById('feedbackClose').click();
    expect(document.getElementById('feedbackModal').classList.contains('active')).toBe(false);
  });

  test('pressing Escape closes modal', () => {
    feedback.openModal();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(document.getElementById('feedbackModal').classList.contains('active')).toBe(false);
  });

  test('clicking overlay closes modal', () => {
    feedback.openModal();
    document.getElementById('feedbackModal').click();
    expect(document.getElementById('feedbackModal').classList.contains('active')).toBe(false);
  });

  test('selectRating stores selected value', () => {
    feedback.selectRating(3);
    expect(feedback.getSelectedRating()).toBe(3);
  });

  test('clicking rating button marks it as selected and clears others', () => {
    const btns = document.querySelectorAll('.rating-btn');
    btns[0].click();
    btns[1].click();
    expect(btns[1].classList.contains('selected')).toBe(true);
    expect(btns[0].classList.contains('selected')).toBe(false);
  });

  test('submitting form shows thank you message and hides form', () => {
    feedback.submitFeedback({ preventDefault: () => {} });
    expect(document.getElementById('feedbackForm').hidden).toBe(true);
    expect(document.getElementById('feedbackThanks').hidden).toBe(false);
  });
});
