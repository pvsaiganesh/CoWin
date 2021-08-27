// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'

const apiStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class CowinDashboard extends Component {
  state = {
    totalData: [],
    currentStatus: apiStatus.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({currentStatus: apiStatus.loading})
    const options = {method: 'GET'}
    const response = await fetch(
      'https://apis.ccbp.in/covid-vaccination-data',
      options,
    )
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = {
        vaccinationByAgeData: data.vaccination_by_age,
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByGenderData: data.vaccination_by_gender,
      }
      this.setState({
        totalData: formattedData,
        currentStatus: apiStatus.success,
      })
    } else {
      this.setState({currentStatus: apiStatus.failure})
    }
  }

  renderView = () => {
    const {totalData, currentStatus} = this.state
    const {
      vaccinationByAgeData,
      vaccinationByGenderData,
      last7DaysVaccination,
    } = totalData
    switch (currentStatus) {
      case apiStatus.success:
        return (
          <div>
            <h1>Vaccination Coverage</h1>
            <VaccinationCoverage data={last7DaysVaccination} />
            <VaccinationByAge data={vaccinationByAgeData} />
            <VaccinationByGender data={vaccinationByGenderData} />
          </div>
        )
      case apiStatus.loading:
        return (
          <div data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
          </div>
        )
      case apiStatus.failure:
        return (
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
              alt="failure view"
            />
            <h1>Something went wrong</h1>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <h1>CoWIN Vaccination in India</h1>
        <img
          src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          alt="website logo"
        />
        {this.renderView()}
      </div>
    )
  }
}
export default CowinDashboard
