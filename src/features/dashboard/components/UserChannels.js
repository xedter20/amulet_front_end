import TitleCard from '../../../components/Cards/TitleCard';

const userSourceData = [
  { source: Date.now(), count: '600', conversionPercent: 10.2 },
  { source: Date.now(), count: '600', conversionPercent: 10.2 },
  { source: Date.now(), count: '600', conversionPercent: 10.2 }
];

function UserChannels() {
  return (
    <TitleCard title={'Daily Bonus'}>
      {/** Table Data */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th className="normal-case">Date Time Generated</th>
              <th className="normal-case">Amount Receivable</th>
              <th className="normal-case">Action</th>
            </tr>
          </thead>
          <tbody>
            {userSourceData.map((u, k) => {
              return (
                <tr key={k}>
                  <th>{k + 1}</th>
                  <td>{u.source}</td>
                  <td>{u.count}</td>
                  <td>
                    <button className="btn btn-sm">
                      <i class="fa-regular fa-thumbs-up"></i>
                      Recieve
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
}

export default UserChannels;
