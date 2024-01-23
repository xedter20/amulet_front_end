import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import {
  setAppSettings,
  getFeatureList
} from '../../features/settings/appSettings/appSettingsSlice';
import CodeGenerator from '../../features/code_generator/components/index';

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Code Generator' }));
    dispatch(getFeatureList());
    // get app settings
    // dispatch(
    //   setAppSettings({
    //     packageList: [],
    //     codeTypeList: []
    //   })
    // );
  }, []);

  return <CodeGenerator />;
}

export default InternalPage;
