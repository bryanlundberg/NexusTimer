import LandingShell from './_landing/LandingShell'
import LandingFooter from './_landing/LandingFooter'
import LandingFeatureTable from './_landing/LandingFeatureTable'

export default function Page() {
  return <LandingShell featureTable={<LandingFeatureTable />} footer={<LandingFooter />} />
}
