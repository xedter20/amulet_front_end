import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import CodeGenerator from '../../features/code_generator/components/index';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Code Generator' }));
  }, []);

  return <CodeGenerator />;
}

export default InternalPage;
