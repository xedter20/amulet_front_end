function AmountStats({ dashboardData }) {
  let dailyBonus = 0;

  let totalAmount = dashboardData.dailyBonus?.totalAmount;

  return (
    <div className="stats bg-base-100 shadow">
      <div className="stat">
        <div className="stat-title">Total Daily Bonus</div>
        <div className="stat-value">Php {totalAmount}</div>
        <div className="stat-actions"></div>
      </div>

      {/* <div className="stat">
        <div className="stat-title">Cash in hand</div>
        <div className="stat-value">$5,600</div>
        <div className="stat-actions"></div>
      </div> */}
    </div>
  );
}

export default AmountStats;
