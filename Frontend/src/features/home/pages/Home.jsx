import FaceExpression from '../../Expressions/components/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/useSong'

const Home = () => {
    const { loading, handleGetSong } = useSong()
  return (
    <>
      <FaceExpression
      loading={loading}
      onMoodDetected={(mood) => handleGetSong({ mood })}/>
      <Player/>
    </>
  )
}

export default Home
