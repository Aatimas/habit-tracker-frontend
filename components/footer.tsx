export default function Footer() {
	return (
		<footer className="w-full bg-gray-100 dark:bg-gray-900 text-center py-4 mt-8">
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Siddhanath Science Campus. <br /> © {new Date().getFullYear()} Habit
				Tracker. All rights reserved.
			</p>
		</footer>
	);
}
