import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TitleCard from '../../../components/Cards/TitleCard';
import { showNotification } from '../../common/headerSlice';

import CheckBadgeIcon from '@heroicons/react/24/outline/CheckBadgeIcon';
import InputText from '../../../components/Input/InputText';
import { Formik, useField, useFormik, Form } from 'formik';
import * as Yup from 'yup';
import Dropdown from '../../../components/Input/Dropdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import ViewColumnsIcon from '@heroicons/react/24/outline/EyeIcon';
import PlusCircleIcon from '@heroicons/react/24/outline/PlusCircleIcon';
import TrashIcon from '@heroicons/react/24/outline/InboxArrowDownIcon';
import { NavLink, Routes, Link, useLocation } from 'react-router-dom';
const BILLS = [
  {
    invoiceNo: '#4567',
    amount: '23,989',
    description: 'Product usages',
    status: 'Pending',
    generatedOn: moment(new Date())
      .add(-30 * 1, 'days')
      .format('DD MMM YYYY'),
    paidOn: '-'
  }
];

const getStatus = status => {
  if (status === 'AVAILABLE')
    return (
      <div className="badge badge-info text-white font-bold">{status}</div>
    );
  if (status === 'USED')
    return <div className="badge badge-warning text-white">{status}</div>;
  else return <div className="badge badge-ghost">{status}</div>;
};
const codeTableComponent = ({ data, appSettings }) => {
  let { codeTypeList, packageList } = appSettings;

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>#</th>
          <th>Type</th>
          <th>Code</th>
          <th>Amulet Package Type</th>
          <th>Date Created</th>
          <th>Approval Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((code, k) => {
          let pt = packageList.find(p => {
            return p.name === code.packageType;
          });
          return (
            <tr key={k}>
              <td>{k + 1}</td>
              <td>
                <span className="text-yellow-800"> {code.type}</span>
              </td>
              <td>
                <span className="font-bold"> {code.name}</span>
              </td>
              <td>{pt && pt.displayName}</td>
              <td>{format(code.dateTimeAdded, 'MMM dd, yyyy hh:mm:ss a')}</td>

              <td>
                {code.dateTimeApproved
                  ? format(code.dateTimeApproved, 'MMM dd, yyyy hh:mm:ss a')
                  : 'N/A'}
              </td>
              <td>{getStatus(code.status)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const PendingCodeBundleTableComponent = ({
  data,
  appSettings,
  setPendingCodesInModalView
}) => {
  let { codeTypeList, packageList } = appSettings;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = bundleId => {
    document.getElementById('viewPendingCodeModal').showModal();

    let selectedBundle = data.find(b => {
      return bundleId === b.bundleId;
    });

    console.log(selectedBundle.codeList);
    setPendingCodesInModalView(selectedBundle.codeList);
  };

  const sendConfirmationForApproval = async bundleId => {
    setIsSubmitting(true);
    try {
      let res = await axios({
        method: 'POST',
        url: 'code/sendConfirmationForApproval',
        data: {
          bundleId
        }
      });
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>#</th>
          <th>Bundle Name</th>
          <th>Total Code(s)</th>
          <th>Amulet Package Type</th>
          <th>Date Created</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((bundle, k) => {
          let selectOneCode = bundle.codeList[0];
          let pt = packageList.find(p => {
            return p.name === selectOneCode.packageType;
          });
          return (
            <tr key={k}>
              <td>{k + 1}</td>
              <td>
                <span className="text-yellow-800"> {bundle.displayName}</span>
              </td>
              <td>
                <span className="font-bold"> {bundle.codeList.length}</span>
              </td>
              <td>{pt && pt.displayName}</td>
              <td>{format(bundle.dateTimeAdded, 'MMM dd, yyyy hh:mm:ss a')}</td>
              <td>
                <div className="flex">
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      openModal(bundle.bundleId);
                    }}>
                    View
                    <ViewColumnsIcon className="h-4 w-4 text-blue-500" />
                  </button>

                  <button
                    className="btn btn-sm ml-2"
                    disabled={isSubmitting}
                    onClick={async () => {
                      if (!isSubmitting) {
                        await sendConfirmationForApproval(bundle.bundleId);
                      }
                    }}>
                    Send
                    <TrashIcon className="h-4 w-4 text-yellow-500" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewModal = () => {
    document.getElementById('createCodeModal').showModal();
  };

  return (
    <div className="inline-block float-right">
      <button className="btn  " onClick={openAddNewModal}>
        <i className="fa-solid fa-circle-plus mr-1"></i>
        Create Code Bundle
      </button>
    </div>
  );
};

function CodeGenerator() {
  const [bills, setBills] = useState(BILLS);

  const appSettings = useSelector(state => state.appSettings);

  const [openTab, setOpenTab] = useState(1);

  const [isLoaded, setIsLoaded] = useState(false);

  const [codeList, setCodes] = useState([]);
  const fetchCodes = async () => {
    let res = await axios({
      method: 'POST',
      url: 'code/getCodeList'
    });
    let codes = res.data.data;
    setCodes(codes);
    setIsLoaded(true);
  };
  useEffect(() => {
    fetchCodes();
  }, []);

  const [pendingCodeList, setPendingCodes] = useState([]);
  const [pendingCodeListModalView, setPendingCodesInModalView] = useState([]);
  const fetchPendingCodes = async () => {
    let res = await axios({
      method: 'POST',
      url: 'code/getPendingCodeList'
    });
    let codes = res.data.data;
    setPendingCodes(codes);
    setIsLoaded(true);
  };
  useEffect(() => {
    fetchPendingCodes();
  }, []);

  const formikConfig = {
    initialValues: {
      codeType: '',
      packageType: '',
      quantity: 20
    },
    validationSchema: Yup.object({
      codeType: Yup.string().required('Required'),
      packageType: Yup.string().required('Required'),
      quantity: Yup.number().required('Required')
    }),
    // validateOnMount: true,
    // validateOnChange: false,
    onSubmit: async (values, { setSubmitting, errors }) => {
      setSubmitting(true);
      try {
        let res = await axios({
          method: 'POST',
          url: 'code/generateCodeBundle',
          data: values
        });
        fetchCodes();
        fetchPendingCodes();
        toast.success('Created Successfully', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
      } catch (error) {
        toast.error('Something went wrong', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
      } finally {
        setSubmitting(false);
        document.getElementById('createCodeModal').close();
      }
    }
  };

  return (
    <div>
      {isLoaded && (
        <div>
          <ToastContainer />
          <TitleCard
            title="Code Generator"
            topMargin="mt-2"
            TopSideButtons={TopSideButtons()}>
            {/* Invoice list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
              <div className="flex flex-wrap">
                <div className="w-full">
                  <ul
                    className="flex mb-0 list-none flex-wrap pt-0 pb-4 flex-row"
                    role="tablist">
                    <li className="mr-2 last:mr-0 flex-auto text-center">
                      <a
                        className={
                          'text-xs font-bold uppercase px-5 py-3 shadow-sm rounded block leading-normal ' +
                          (openTab === 1
                            ? 'text-white bg-green-500 rounded-lg shadow-lg'
                            : 'text-green-500 bg-green-50 shadow-md')
                        }
                        onClick={e => {
                          e.preventDefault();
                          setOpenTab(1);
                        }}
                        data-toggle="tab"
                        href="#link1"
                        role="tablist">
                        <i className="fa-solid fa-check-to-slot mr-2"></i>
                        Generated
                      </a>
                    </li>
                    <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                      <a
                        className={
                          'text-xs font-bold uppercase px-5 py-3 shadow-sm rounded block leading-normal ' +
                          (openTab === 2
                            ? 'text-white bg-green-500 rounded-lg shadow-lg'
                            : 'text-green-500 bg-green-50 shadow-md')
                        }
                        onClick={e => {
                          e.preventDefault();
                          setOpenTab(2);
                        }}
                        data-toggle="tab"
                        href="#link2"
                        role="tablist">
                        <i className="fa-solid fa-hourglass-half mr-2"></i>
                        Pending
                      </a>
                    </li>
                  </ul>
                  <div className="">
                    <div className="w-full">
                      <div>
                        <div
                          className={openTab === 1 ? 'block' : 'hidden'}
                          id="link1">
                          <div className="w-full">
                            {' '}
                            {codeTableComponent({
                              data: codeList,
                              appSettings
                            })}
                          </div>
                        </div>
                        <div
                          className={openTab === 2 ? 'block' : 'hidden'}
                          id="link2">
                          <PendingCodeBundleTableComponent
                            data={pendingCodeList}
                            appSettings={appSettings}
                            setPendingCodesInModalView={
                              setPendingCodesInModalView
                            }
                          />
                        </div>
                        <div
                          className={openTab === 3 ? 'block' : 'hidden'}
                          id="link3">
                          3
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TitleCard>
          <Formik {...formikConfig}>
            {({
              handleSubmit,
              handleChange,
              handleBlur, // handler for onBlur event of form elements
              values,
              touched,
              errors,
              submitForm,
              setFieldTouched,
              setFieldValue,
              setFieldError,
              setErrors,
              isSubmitting
            }) => {
              let { codeTypeList, packageList } = appSettings;
              return (
                <dialog
                  id="createCodeModal"
                  className="modal modal-bottom sm:modal-middle">
                  <div className="modal-box w-11/12 max-w-3xl">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <h3 className="font-bold text-lg">Generate Code(s)</h3>
                    <div className="divider"></div>
                    <Form>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                        <Dropdown
                          // icons={mdiAccount}
                          label="Code Type"
                          name="codeType"
                          type="text"
                          placeholder=""
                          value={values.codeType}
                          setFieldValue={setFieldValue}
                          onBlur={handleBlur}
                          options={codeTypeList.map(val => {
                            return {
                              value: val.name,
                              label: val.displayName
                            };
                          })}
                          affectedInput="codeType"
                          affectedInputValue="codeType"
                        />
                        <Dropdown
                          label="Amulet Package"
                          name="packageType"
                          type="text"
                          placeholder=""
                          value={values.packageType}
                          setFieldValue={setFieldValue}
                          onBlur={handleBlur}
                          options={packageList.map(val => {
                            return {
                              value: val.name,
                              label: val.displayName
                            };
                          })}
                          affectedInput="packageType"
                          affectedInputValue="packageType"
                        />
                      </div>
                      <InputText
                        // icons={mdiEmailCheckOutline}

                        label="Quantity"
                        name="quantity"
                        type="number"
                        placeholder=""
                        min="1"
                        max="100"
                        value={values.quantity}

                        // onChange={handleEmailChange}
                      />
                      <button
                        type="submit"
                        className="btn mt-2 justify-end  btn-primary float-right"
                        disabled={isSubmitting}>
                        Submit
                      </button>
                    </Form>
                  </div>
                </dialog>
              );
            }}
          </Formik>

          <dialog
            id="viewPendingCodeModal"
            className="modal modal-bottom sm:modal-middle">
            <div className="modal-box w-11/12 max-w-3xl">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">List of Code(s)</h3>
              <div className="divider"></div>

              {codeTableComponent({
                data: pendingCodeListModalView,
                appSettings
              })}
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
}

export default CodeGenerator;
