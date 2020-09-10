import { Breadcrumb } from 'antd';
import Link from 'next/link';

export default function Breadcrumbs({ category }) {
	return (
		<>
			{category && (
				<Breadcrumb>
					<Breadcrumb.Item>
						<Link href="/">
							<a>{category[0]}</a>
						</Link>
					</Breadcrumb.Item>
					<Breadcrumb.Item>
						<Link href="/">
							<a>{category[1]}</a>
						</Link>
					</Breadcrumb.Item>
					<Breadcrumb.Item>
						<Link href="/">
							<a>{category[2]}</a>
						</Link>
					</Breadcrumb.Item>
				</Breadcrumb>
			)}
		</>
	);
}
