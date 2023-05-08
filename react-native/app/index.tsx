import { Link } from 'expo-router'
import { View, Text } from 'react-native'

const Home = () => {
  return (
    <View>
      <Text>Landing Page</Text>
      <Link href="/home">Home</Link>
      <Link href="/send">Send</Link>
    </View>
  )
}

export default Home
