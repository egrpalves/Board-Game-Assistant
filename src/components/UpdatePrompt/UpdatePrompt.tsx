import { useEffect, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';
import styles from './UpdatePrompt.module.scss';

const POLL_INTERVAL = 60 * 60 * 1000; // 1 hour

export default function UpdatePrompt() {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      registrationRef.current = registration ?? null;
    },
  });

  useEffect(() => {
    const check = () => {
      registrationRef.current?.update();
    };

    const interval = setInterval(check, POLL_INTERVAL);
    document.addEventListener('visibilitychange', check);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);

  if (!needRefresh) return null;

  return (
    <div className={styles.banner}>
      <span className={styles.message}>Nova atualização disponível</span>
      <button
        className={styles.updateButton}
        onClick={() => updateServiceWorker(true)}
      >
        <RefreshCw size={16} />
        Atualizar Agora
      </button>
    </div>
  );
}
