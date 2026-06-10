import useAuth from '../hooks/useAuth';

function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Please log in.</div>;
  }

  return (
    <div>
      Welcome, {user.name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}