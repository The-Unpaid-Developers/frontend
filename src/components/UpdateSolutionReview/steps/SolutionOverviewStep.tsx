import React, { useState, useEffect } from "react";
import { Button, Input, DropDown, Card, CardHeader, CardTitle, CardContent } from "../../ui";
import type { StepProps } from "./StepProps";
import type { SolutionOverview } from "../../../types/solutionReview";
import { useUpdateSolutionReview } from "../../../hooks/useUpdateSolutionReview";
import {
  APPLICATION_USER_OPTIONS,
  REVIEW_TYPE_OPTIONS,
  BUSINESS_UNIT_OPTIONS,
  BUSINESS_DRIVER_OPTIONS,
} from "./DropDownListValues";

const emptyData: SolutionOverview = {
  solutionDetails: {
    solutionName: "",
    projectName: "",
    solutionArchitectName: "",
    deliveryProjectManagerName: "",
    itBusinessPartner: "",
  },
  reviewType: "",
  businessUnit: "",
  businessDriver: "",
  valueOutcome: "",
  applicationUsers: [],
};

const SolutionOverviewStep: React.FC<StepProps> = ({
  onSave,
  isSaving = false,
  initialData,
}) => {
  console.log(initialData);
  const systemCode = initialData.systemCode ?? "";
  const [data, setData] = useState<SolutionOverview>(
    initialData.solutionOverview ?? emptyData
  );
  const [appUser, setAppUser] = useState("");

  useEffect(() => {
    if (initialData.solutionOverview) {
      setData(initialData.solutionOverview);
    }
  }, [initialData.solutionOverview]);
  const update = (k: keyof SolutionOverview, v: any) =>
    setData((d) => ({ ...d, [k]: v }));

  const updateSolutionDetails = <
    K extends keyof SolutionOverview["solutionDetails"]
  >(
    k: K,
    v: SolutionOverview["solutionDetails"][K]
  ) =>
    setData((d) => ({
      ...d,
      solutionDetails: { ...d.solutionDetails, [k]: v },
    }));

  const addUser = () => {
    if (!appUser.trim()) return;
    update("applicationUsers", [...data.applicationUsers, appUser.trim()]);
    setAppUser("");
  };

  const removeUser = (u: string) =>
    update(
      "applicationUsers",
      data.applicationUsers.filter((x) => x !== u)
    );

  const save = async () => {
    await onSave(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Solution Overview</h2>
        <p className="text-gray-600">Provide comprehensive details about your solution architecture</p>
      </div> */}

      {/* Solution Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Solution Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Solution Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter solution name"
                value={data.solutionDetails.solutionName}
                onChange={(e) =>
                  updateSolutionDetails("solutionName", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter project name"
                value={data.solutionDetails.projectName}
                onChange={(e) => updateSolutionDetails("projectName", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System Code
              </label>
              <Input 
                placeholder="System code" 
                value={systemCode} 
                disabled 
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Solution Architect <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter solution architect name"
                value={data.solutionDetails.solutionArchitectName}
                onChange={(e) =>
                  updateSolutionDetails("solutionArchitectName", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Project Manager
              </label>
              <Input
                placeholder="Enter delivery PM name"
                value={data.solutionDetails.deliveryProjectManagerName}
                onChange={(e) =>
                  updateSolutionDetails("deliveryProjectManagerName", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IT Business Partner
              </label>
              <Input
                placeholder="Enter IT business partner name"
                value={data.solutionDetails.itBusinessPartner}
                onChange={(e) =>
                  updateSolutionDetails("itBusinessPartner", e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Context Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Business Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Type <span className="text-red-500">*</span>
              </label>
              <DropDown
                placeholder="Select review type"
                value={data.reviewType}
                onChange={(e) => update("reviewType", e.target.value)}
                options={REVIEW_TYPE_OPTIONS}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Unit <span className="text-red-500">*</span>
              </label>
              <DropDown
                placeholder="Select business unit"
                value={data.businessUnit}
                onChange={(e) => update("businessUnit", e.target.value)}
                options={BUSINESS_UNIT_OPTIONS}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Driver <span className="text-red-500">*</span>
              </label>
              <DropDown
                placeholder="Select business driver"
                value={data.businessDriver}
                onChange={(e) => update("businessDriver", e.target.value)}
                options={BUSINESS_DRIVER_OPTIONS}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value Outcomes
              </label>
              <Input
                placeholder="Describe expected value outcomes"
                value={data.valueOutcome}
                onChange={(e) => update("valueOutcome", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Users Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Application Users ({data.applicationUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <DropDown
                  placeholder="Select application user type"
                  value={appUser}
                  onChange={(e) => setAppUser(e.target.value)}
                  options={APPLICATION_USER_OPTIONS}
                />
              </div>
              <Button
                type="button"
                onClick={addUser}
                disabled={!appUser.trim()}
                variant="secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </Button>
            </div>

            {data.applicationUsers.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Users:</h4>
                <div className="flex flex-wrap gap-2">
                  {data.applicationUsers.map((user) => (
                    <div key={user} className="flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                      <span>{user}</span>
                      <button
                        type="button"
                        onClick={() => removeUser(user)}
                        className="ml-2 text-primary-500 hover:text-primary-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button 
          disabled={isSaving} 
          onClick={save}
          className="min-w-[120px]"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SolutionOverviewStep;


