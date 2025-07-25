import React from 'react'
import SkillsAndProjects from './freelancer/SkillsAndProjects'
import Jobs from './freelancer/Jobs'
import ClientJobs from './client/ClientJobs'
import ApplicantsList from './client/ApplicantsList'

const ProfileDetails = () => {
  return (
   <div className="tabs tabs-box">
        <input type="radio" name="profile_details_tab" className="tab" aria-label="Skills and Projects" defaultChecked />
        <div className="tab-content bg-base-100 p-6">
            <SkillsAndProjects/>
        </div>

        <input type="radio" name="profile_details_tab" className="tab" aria-label="Jobs" />
        <div className="tab-content bg-base-100 p-6">
            <Jobs/>
        </div>
        <input type="radio" name="profile_details_tab" className="tab" aria-label="Client Jobs" />
        <div className="tab-content bg-base-100 p-6">
            <ClientJobs/>
        </div>
        <div className="tab-content bg-base-100 p-6">
            <ApplicantsList/>
        </div>
    </div>
  )
}

export default ProfileDetails