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

const getPaymentStatus = status => {
  if (status === 'Paid')
    return <div className="badge badge-success">{status}</div>;
  if (status === 'Pending')
    return <div className="badge badge-primary">{status}</div>;
  else return <div className="badge badge-ghost">{status}</div>;
};
const generatedCodes = () => {
  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Invoice No</th>
          <th>Invoice Generated On</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Invoice Paid On</th>
        </tr>
      </thead>
      <tbody>
        {BILLS.map((l, k) => {
          return (
            <tr key={k}>
              <td>{l.invoiceNo}</td>
              <td>{l.generatedOn}</td>
              <td>{l.description}</td>
              <td>${l.amount}</td>
              <td>{getPaymentStatus(l.status)}</td>
              <td>{l.paidOn}</td>
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
        <i class="fa-solid fa-circle-plus mr-1"></i>
        Create Code Bundle
      </button>
    </div>
  );
};

function Billing() {
  const [bills, setBills] = useState(BILLS);

  const [openTab, setOpenTab] = useState(1);
  const formikConfig = {
    initialValues: {
      quantity: 20
    },
    validationSchema: Yup.object({}),
    // validateOnMount: true,
    // validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      console.log('Dex');
    }
  };

  return (
    <>
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
                    <i class="fa-solid fa-check-to-slot mr-2"></i>
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
                    <i class="fa-solid fa-hourglass-half mr-2"></i>Pending
                  </a>
                </li>
              </ul>
              <div className="">
                <div className="w-full">
                  <div>
                    <div
                      className={openTab === 1 ? 'block' : 'hidden'}
                      id="link1">
                      <div className="w-full"> {generatedCodes()}</div>
                    </div>
                    <div
                      className={openTab === 2 ? 'block' : 'hidden'}
                      id="link2">
                      2
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
                      label="Type"
                      name="targetUserID"
                      type="text"
                      placeholder=""
                      value={values.targetUserID}
                      setFieldValue={setFieldValue}
                      onBlur={handleBlur}
                      options={[]}
                      affectedInput="targetUserID"
                      affectedInputValue="id"
                    />
                    <Dropdown
                      label="Package"
                      name="package"
                      type="text"
                      placeholder=""
                      value={values.position}
                      setFieldValue={setFieldValue}
                      onBlur={handleBlur}
                      options={[]}
                      affectedInput="position"
                      affectedInputValue="id"
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
    </>
  );
}

export default Billing;
