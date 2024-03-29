import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import Dashboard from '../../features/dashboard/index';
import Tree from 'react-d3-tree';
import axios from 'axios';
import InputText from '../../components/Input/InputText';
import { Formik, useField, useFormik, Form } from 'formik';
import * as Yup from 'yup';
import Dropdown from '../../components/Input/Dropdown';
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon';

import './customTree.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TitleCard from '../../components/Cards/TitleCard';
import { mdiAccount } from '@mdi/js';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
const renderNodeWithCustomEvents = ({
  nodeDatum,
  toggleNode,
  handleNodeClick,
  setFieldValue,
  setAvailablePosition
}) => {
  let matchCount = nodeDatum.matchingPairs.filter(({ status }) => {
    return status === 'PENDING';
  }).length;
  const nodeSize = { x: '12%', y: '20%' };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: -60,
    y: 40
  };
  return (
    <g>
      <circle
        // stroke="#a21caf"
        fill="#334155"
        r="35"
        onClick={async () => {
          handleNodeClick(nodeDatum);
          setFieldValue('parentNodeName', nodeDatum.name);
          setFieldValue('parentNodeEmail', nodeDatum.attributes.displayID);
          setFieldValue('parentNodeID', nodeDatum.attributes.ID);

          if (nodeDatum.matchingPairs < 2) {
            let res = await axios({
              method: 'POST',
              url: 'user/getUserNodeWithChildren',
              data: {
                ID: nodeDatum.attributes.ID
              }
            });

            setAvailablePosition(res.data.data);
          }
        }}
      />
      <text
        fill="#94a3b8"
        fontWeight="bold"
        strokeWidth="0"
        x="-8"
        y="5"
        onClick={toggleNode}
        fontSize="12"
        fontWeightt="10">
        {nodeDatum.name
          .match(/\b(\w)/g)
          .join('')
          .toUpperCase()}
      </text>

      <foreignObject {...foreignObjectProps}>
        <div className="alert alert shadow-lg bg-white">
          <h6 className="text-xs font-normal text-gray-800 text-center h6 ml-2">
            {nodeDatum.name}
          </h6>
          {/* <hr /> */}

          {/* <h6 className="text-xs font-bold text-gray-800 text-center h6">
            Total Points:
          </h6> */}
        </div>
        {/* <div style={{ border: '1px solid black', backgroundColor: '#dedede' }}>
          <h3 style={{ textAlign: 'center' }}>{nodeDatum.name}</h3>
        </div> */}
        {/* <text
          fill="#1e293b"
          fontWeight="normal"
          strokeWidth="0"
          x="-40"
          y="60"
          onClick={toggleNode}
          fontSize="10"
          fontWeightt="2">
          {nodeDatum.name} {matchCount ? ` - Match Count: ${matchCount}` : ''}
        </text> */}
      </foreignObject>

      {/* {nodeDatum.attributes?.email && (
      <text fill="black" x="20" dy="20" strokeWidth="1">
        Department: {nodeDatum.attributes?.email}
      </text>
    )} */}
    </g>
  );
};

const straightPathFunc = (linkDatum, orientation) => {
  const { source, target } = linkDatum;
  return orientation === 'horizontal'
    ? `M${source.y},${source.x}L${target.y},${target.x}`
    : `M${source.x},${source.y}L${target.x},${target.y}`;
};

function InternalPage() {
  const dispatch = useDispatch();
  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef(null);
  const [treeStucture, setTreeStucture] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUser] = useState([]);
  let userDetails = JSON.parse(localStorage.getItem('loggedInUser'));

  const [availablePosition, setAvailablePosition] = useState([
    { value: 'LEFT', label: 'Left' },
    { value: 'RIGHT', label: 'Right' }
  ]);

  useEffect(() => {
    dispatch(setPageTitle({ title: 'Network Tree' }));
    if (treeContainerRef.current && shouldRecenterTreeRef.current) {
      shouldRecenterTreeRef.current = false;
      const dimensions = treeContainerRef.current.getBoundingClientRect();

      setTreeTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 8
      });
    }
  }, []);

  const [pairMatchedUsers, setPairMatchedUsers] = useState([]);
  const getTreeStructure = async () => {
    let res = await axios({
      method: 'POST',
      url: 'user/getTreeStructure'
    });
    let treeStucture = res.data.data;
    setTreeStucture(treeStucture);
    setIsLoaded(true);
  };
  useEffect(() => {
    getTreeStructure();
  }, []);
  const fetchUsers = async () => {
    let res = await axios({
      method: 'POST',
      url: 'user/getMySponseelist',
      data: {
        sponsorIdNumber: ''
      }
    });

    let list = res.data
      .filter(({ parentID, isRootNode }) => {
        return !isRootNode && !parentID;
      })
      .map(({ ID, firstName, lastName }) => {
        return {
          value: ID,
          label: `${firstName} ${lastName}`
        };
      });

    setUser(list);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const [networkNode, setNetworkNode] = useState([]);
  const getNetworkNode = async () => {
    let res = await axios({
      method: 'POST',
      url: 'user/getNetworkNodeList'
    });

    let list = res.data.data;

    setNetworkNode(list);
    // setIsLoaded(true);
  };
  useEffect(() => {
    getNetworkNode();
  }, []);

  const [leftFLoaterData, setLeftFLoaterData] = useState([]);
  const fetchFloaterData = async () => {
    let res = await axios({
      method: 'POST',
      url: 'user/listFloaterData',
      data: {
        floaterPosition: 'LEFT'
      }
    });

    let list = res.data.data;

    setLeftFLoaterData(list);
  };

  const [rightFLoaterData, setRightFLoaterData] = useState([]);
  const fetchRightFloaterData = async () => {
    let res = await axios({
      method: 'POST',
      url: 'user/listFloaterData',
      data: {
        floaterPosition: 'RIGHT'
      }
    });

    let list = res.data.data;

    setRightFLoaterData(list);
  };

  useEffect(() => {
    fetchFloaterData();
    fetchRightFloaterData();
  }, []);

  const handleNodeClick = nodeDatum => {
    if (nodeDatum.children.length === 2) {
      setPairMatchedUsers(nodeDatum.matchingPairs);
      document.getElementById('viewModal').showModal();
    } else {
      document.getElementById('createChildModal').showModal();
    }
  };

  const formikConfig = {
    initialValues: {
      parentNodeName: '',
      parentNodeEmail: '',
      targetUserID: '',
      parentNodeID: '',
      position: '',
      code: ''
    },
    validationSchema: Yup.object({
      parentNodeName: Yup.string().required('Required'),
      parentNodeEmail: Yup.string().required('Required'),
      targetUserID: Yup.string().required('Required'),
      parentNodeID: Yup.string().required('Required'),
      position: Yup.string().required('Required'),
      code: Yup.string().required('Required')
    }),
    // validateOnMount: true,
    // validateOnChange: false,
    onSubmit: async (values, { setSubmitting, errors, setFieldError }) => {
      try {
        setSubmitting(true);

        let res = await axios({
          method: 'POST',
          url: 'user/createChildren',
          data: {
            parentNodeID: values.parentNodeID,
            position: values.position,
            targetUserID: values.targetUserID,
            code: values.code
          }
        });
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
        document.getElementById('createChildModal').close();
        // reload
        getTreeStructure();
        fetchUsers();
        getNetworkNode();
      } catch (error) {
        let message = error.response.data.message;

        if (message === 'invalid_code') {
          setFieldError(
            'code',
            `The coupon code you entered is not valid. Please double-check the code and try again.`
          );
        } else {
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
          document.getElementById('createChildModal').close();
        }
      } finally {
        setSubmitting(false);
      }
    }
  };

  const avatarComponent = () => {
    return (
      <div className="mask mask-circle w-10 h-10">
        <img
          src="https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg?w=740"
          alt="Avatar"
        />
      </div>
    );
  };

  const approvedTransaction = async ({ ID }) => {
    await axios({
      method: 'POST',
      url: 'transaction/approvedMatching',
      data: {
        ID
      }
    });
  };
  return (
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
        console.log(errors);
        return (
          <div>
            <div className="p-2 ">
              <ul className="menu bg-white lg:menu-horizontal rounded-box shadow-md">
                <li>
                  <a>
                    <i class="fa-solid fa-network-wired"></i>
                    Network
                    {/* <span className="badge badge-sm">99+</span> */}
                  </a>
                </li>
                <li>
                  <a>
                    <i class="fa-solid fa-angles-left"></i>
                    Left
                    {/* <span className="badge badge-sm badge-warning">NEW</span> */}
                  </a>
                </li>
                <li>
                  <a>
                    <i class="fa-solid fa-angles-right"></i>
                    Right
                    {/* <span className="badge badge-sm badge-warning">NEW</span> */}
                  </a>
                </li>
              </ul>
            </div>
            <div
              ref={treeContainerRef}
              style={{ height: '100vh' }}
              className="">
              {/* <div className="">
              {isLoaded && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TitleCard key={'key'} title={'Network'} topMargin={'mt-2'}>
                    <table className="table table-xs">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Name</th>
                          <th>Position</th>
                          <th>Points</th>
                          <th>Date</th>

                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {networkNode.map((node, index) => {
                          let fullName = `${node.childDetails.firstName} ${node.childDetails.lastName}`;

                          let data = JSON.parse(node.list_ParentsOfParents);

                          let foundData = {};

                          let isDirectParent =
                            node.parentID === userDetails.userId;

                          if (isDirectParent) {
                            foundData = {
                              position: node.position
                            };
                          } else {
                            foundData = data.find(user => {
                              return user.ID === userDetails.userId;
                            });
                          }

                          return (
                            <tr>
                              <th></th>
                              <th>{fullName}</th>
                              <th>{foundData && foundData.position}</th>
                              <th>{node.points}</th>
                              <td>
                                {format(
                                  node.date_created,
                                  'MMM dd, yyyy hh:mm:ss a'
                                )}
                              </td>
                              <th>
                                <button
                                  disabled={node.isDisabledInUI}
                                  className="btn btn-outline btn-sm ml-2 btn-success"
                                  onClick={async () => {
                                    let res = await axios({
                                      method: 'POST',
                                      url: 'user/createFloater',
                                      data: {
                                        ID: node.ID
                                      }
                                    });
                                    await getNetworkNode();
                                    await fetchFloaterData();
                                    await fetchRightFloaterData();
                                  }}>
                                  Receive
                                </button>
                              </th>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </TitleCard>
                  <div className="bg-white shadow-lg overflow-x-auto">
                    <h6 className="text-md font-bold leading-tight tracking-tight text-gray-700 dark:text-white m-2">
                      Left Floater
                    </h6>
                    <table className="table table-xs">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Name</th>
                          <th>Points</th>
                          <th>Action</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leftFLoaterData.map(
                          ({ status, points, action_type, fromUser }) => {
                            let fullName = `${fromUser.firstName} ${fromUser.lastName}`;
                            return (
                              <tr>
                                <th></th>
                                <th>{fullName}</th>
                                <th>{points.low}</th>
                                <th>{action_type}</th>
                                <th>{status ? 'TRUE' : 'FALSE'}</th>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-white shadow-lg overflow-x-auto">
                    <h6 className="text-md font-bold leading-tight tracking-tight text-gray-700 dark:text-white m-2">
                      Right Floater
                    </h6>
                    <table className="table table-xs">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Name</th>
                          <th>Points</th>
                          <th>Action</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      {rightFLoaterData.map(
                        ({ status, points, action_type, fromUser }) => {
                          let fullName = `${fromUser.firstName} ${fromUser.lastName}`;
                          return (
                            <tr>
                              <th></th>
                              <th>{fullName}</th>
                              <th>{points.low}</th>
                              <th>{action_type}</th>
                              <th>{status ? 'TRUE' : 'FALSE'}</th>
                            </tr>
                          );
                        }
                      )}
                    </table>
                  </div>
                </div>
              )}
            </div> */}
              {isLoaded && (
                <Tree
                  rootNodeClassName="node__root"
                  branchNodeClassName="node__branch"
                  leafNodeClassName="node__leaf"
                  data={treeStucture}
                  orientation="vertical"
                  pathFunc="step"
                  translate={treeTranslate}
                  collapsible={false}
                  separation={{
                    siblings: 2,
                    nonSiblings: 2
                  }}
                  renderCustomNodeElement={rd3tProps =>
                    renderNodeWithCustomEvents({
                      ...rd3tProps,
                      handleNodeClick,
                      setFieldValue,
                      setAvailablePosition
                    })
                  }
                />
              )}
              <dialog id="createChildModal" className="modal">
                <div className="modal-box w-11/12 max-w-3xl">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-lg">Add New Branch</h3>

                  <Form>
                    <div className="divider">Placement Information</div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                      <InputText
                        icons={mdiAccount}
                        disabled
                        label="Placement Name"
                        name="parentNodeName"
                        type="text"
                        placeholder=""
                        value={values.parentNodeName}

                        // onChange={handleEmailChange}
                      />
                      <InputText
                        // icons={mdiEmailCheckOutline}
                        disabled
                        label="Placement ID"
                        name="parentNode_Id"
                        type="text"
                        placeholder=""
                        value={values.parentNodeEmail}

                        // onChange={handleEmailChange}
                      />
                    </div>
                    <div className="divider">Newly Registered Downlines</div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-2 ">
                      <Dropdown
                        // icons={mdiAccount}
                        label="Name"
                        name="targetUserID"
                        type="text"
                        placeholder=""
                        value={values.targetUserID}
                        setFieldValue={setFieldValue}
                        onBlur={handleBlur}
                        options={users}
                        affectedInput="targetUserID"
                        affectedInputValue="id"
                      />
                      <Dropdown
                        label="Position"
                        name="position"
                        type="text"
                        placeholder=""
                        value={values.position}
                        setFieldValue={setFieldValue}
                        onBlur={handleBlur}
                        options={availablePosition}
                        affectedInput="position"
                        affectedInputValue="id"
                      />
                    </div>
                    <div className="divider">Code Coupon</div>
                    <InputText
                      // icons={mdiEmailCheckOutline}

                      label="Enter Code"
                      name="code"
                      type="text"
                      placeholder=""
                      value={values.code}

                      // onChange={handleEmailChange}
                    />
                    <button
                      type="submit"
                      className="btn mt-2 justify-end  btn-neutral float-right"
                      disabled={isSubmitting}>
                      Submit
                    </button>
                  </Form>
                </div>
              </dialog>
              <dialog id="viewModal" className="modal">
                <div className="modal-box w-11/12 max-w-4xl">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-lg">Details</h3>

                  <Form>
                    <div className="overflow-x-auto"></div>
                  </Form>
                </div>
              </dialog>
              <ToastContainer />
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default InternalPage;
