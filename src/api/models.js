const API_BASE        = 'http://localhost:8082/api';
export const TRAIN_LSTM_API = 'http://localhost:7001/train';   // FastAPI trainer
export const TRAIN_RL_API   = 'http://localhost:7002/train';   // RL trainer

/* ─────────────────────── list models ─────────────────────── */
export const getModels = async (roomId) => {
  const res = await fetch(`${API_BASE}/models/room-models/${roomId}`);
  if (!res.ok) throw new Error('Could not load models');
  const json = await res.json();
  return Array.isArray(json.models) ? json.models : json;
};

/* ─────────────────────── train LSTM ──────────────────────── */
export const createLstmModel = async ({
                                        roomId,
                                        simulationId,
                                        HIDDEN_SIZE,
                                        NUM_LAYERS,
                                        SEQ_LENGTH,
                                        batch_size,
                                        epochs_number,
                                      }) => {
  const res = await fetch(TRAIN_LSTM_API, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({
      roomId,
      simulationId,
      HIDDEN_SIZE,
      NUM_LAYERS,
      SEQ_LENGTH,
      batch_size,
      epochs_number,
    }),
  });
  if (!res.ok) throw new Error('LSTM training failed');
  return res.json();                     // { modelId, metrics:{…} }
};

/* ─────────────────────── train RL ────────────────────────── */
export async function createRlModel(roomId, {  iterations, timestepSeconds, lr, gamma, eps  }) {
  const res = await fetch('http://localhost:7002/train', {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({
      roomId,                    // ← додали
      controllerType  : 'TRAIN_RL',
      iterations,
      timestepSeconds,
      lr,
      gamma,
      eps
    })
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`RL training failed: ${msg}`);
  }
  return res.json();
}
/* ─────────────────────── activate model ─────────────────── */
export const setModelActive = async (roomId, modelId) => {
  const res = await fetch(
    `${API_BASE}/rooms/${roomId}/models/${modelId}/activate`,
    { method: 'POST' }
  );
  if (!res.ok) throw new Error('Failed to activate model');
  const json = await res.json();
  return Array.isArray(json.models) ? json.models : json;
};