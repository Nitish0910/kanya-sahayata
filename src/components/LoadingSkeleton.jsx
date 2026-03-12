import styles from './LoadingSkeleton.module.css';

export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  if (type === 'page') {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.banner}>
          <div className={`${styles.skeleton} ${styles.bannerTitle}`}></div>
          <div className={`${styles.skeleton} ${styles.bannerDivider}`}></div>
        </div>
        <div className={styles.content}>
          <div className={styles.grid}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className={styles.card}>
                <div className={`${styles.skeleton} ${styles.cardIcon}`}></div>
                <div className={`${styles.skeleton} ${styles.cardTitle}`}></div>
                <div className={`${styles.skeleton} ${styles.cardText}`}></div>
                <div className={`${styles.skeleton} ${styles.cardText} ${styles.short}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={styles.tableContainer}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={styles.tableRow}>
            <div className={`${styles.skeleton} ${styles.tableCell}`}></div>
            <div className={`${styles.skeleton} ${styles.tableCell} ${styles.wide}`}></div>
            <div className={`${styles.skeleton} ${styles.tableCell}`}></div>
            <div className={`${styles.skeleton} ${styles.tableCell} ${styles.short}`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={`${styles.skeleton} ${styles.avatar}`}></div>
          <div>
            <div className={`${styles.skeleton} ${styles.profileName}`}></div>
            <div className={`${styles.skeleton} ${styles.profileEmail}`}></div>
          </div>
        </div>
        <div className={styles.profileGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.profileField}>
              <div className={`${styles.skeleton} ${styles.fieldLabel}`}></div>
              <div className={`${styles.skeleton} ${styles.fieldInput}`}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: card skeleton
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={`${styles.skeleton} ${styles.cardIcon}`}></div>
          <div className={`${styles.skeleton} ${styles.cardTitle}`}></div>
          <div className={`${styles.skeleton} ${styles.cardText}`}></div>
          <div className={`${styles.skeleton} ${styles.cardText} ${styles.short}`}></div>
        </div>
      ))}
    </div>
  );
}
