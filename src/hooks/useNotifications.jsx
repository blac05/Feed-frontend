import useNotifications from './path/to/useNotifications';

function NotificationsComponent() {
  const handleNotification = (notificationData) => {
    // handle the notification
    console.log('Received notification:', notificationData);
  };

  useNotifications(handleNotification);

  return (
    <div>
      {/* Your UI */}
    </div>
  );
}